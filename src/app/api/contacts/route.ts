import { google } from 'googleapis';
import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
import Contact from '@/models/Contact';  
import connectDb from '@/lib/dbConnect'; 

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 });
  }

  try {
  
    await connectDb();

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token.accessToken });

    const people = google.people({ version: 'v1', auth: oauth2Client });

  
    const response = await people.people.connections.list({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,phoneNumbers',
    });

    const googleContacts = response.data.connections || [];

    for (const googleContact of googleContacts) {
      const displayName = googleContact.names?.[0]?.displayName || 'Unnamed Contact';
      const emailAddress = googleContact.emailAddresses?.[0]?.value || 'No email available';
      const phoneNumber = googleContact.phoneNumbers?.[0]?.value || 'No phone available';
      const googleId = googleContact.resourceName?.split('/')[1];
      
      let contact = await Contact.findOne({ googleId });

      if (contact) {
        contact.displayName = displayName;
        contact.emailAddress = emailAddress;
        contact.phoneNumber = phoneNumber;
        contact.updatedAt = Date.now();
        await contact.save();
        console.log(`Updated contact: ${displayName}`);
      } else {
        contact = new Contact({ displayName, emailAddress, phoneNumber,  googleId });
        await contact.save();
        console.log(`Created new contact: ${displayName}`);
      }
    }

    const mongoContacts = await Contact.find();

    for (const googleContact of googleContacts) {
      const googleId = googleContact.resourceName?.split('/')[1];

      const mongoContact = await Contact.findOne({ googleId });

      if (!mongoContact) {
        try {
          await people.people.deleteContact({
            resourceName: `people/${googleId}`,
          });
          console.log(`Deleted contact from Google: ${googleId}`);
        } catch (error) {
          console.error(`Error deleting Google contact ${googleId}:`, error);
        }
      }
    }

    for (const mongoContact of mongoContacts) {
      const googleId = mongoContact.googleId;

      const googleContactExists = googleContacts.some(
        (googleContact) => googleContact.resourceName?.split('/')[1] === googleId
      );

      if (!googleContactExists) {
        await mongoContact.deleteOne(); 
        console.log(`Deleted contact from MongoDB: ${mongoContact.displayName}`);
      }
    }

 const contacts = await Contact.find();
      
 return new Response(JSON.stringify({ contacts }), { status: 200 });
  
  } catch (error: unknown) {
    console.error('Error syncing contacts:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to sync contacts: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to sync contacts' }, { status: 500 });
  }
}
