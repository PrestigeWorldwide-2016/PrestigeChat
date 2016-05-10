

Team Name: Prestige World Wide 2016
Project Name: Prestige Messaging

1. Introduction
1.1 Purpose
This document describes the requirements for the design of enterprise class group messaging software. The requirements will be described in a use case format identifying the basic system flow. The process requirements for creating a new user, interaction with the software (i.e. login, messaging, blocking, muting, archiving, logout) are described in the use case specification.

1.2 Background
We recognize a room for competition with popular enterprise messaging web/mobile app Slack and we envision ourselves becoming the next unicorn startup.

Actors:
User(s) - Organizations interested in using a group chat to communicate with one another efficiently.
Admin(s) - Persons that moderate the chat groups. This person has the ability to create and delete the chat, also able to block a user from joining the chat

Use Cases:
User Creation -> Joseph
User signs up and enters credentials 
Checks if credentials are valid
Chooses a username
Checks if username is professional 
Chooses a profile picture (linked to LinkedIn)
Splash/ Welcome Screen
Functional as a loading screen
Introduction to the software to the user
Will only show once to the user once they have created an account
Customizable to the company to show their name on it
User login -> Rebecca
Will be a popup screen on top of the splash screen
A link will be given below the password and username entry to go to create a new account.
All account information will be cross-checked with the data base to ensure unwanted users are not given permissions in the chats
Home Page ->
After the splash screen, this will also for the most part just be a more visual aspect
There will be the login button, and a create new account option available
Though here, the new account option will still show up again in small text under the login window.

Choosing a contact/group chat -- JC
User selects and clicks on a contact/group chat
System auto populates chat view with information from database:
Recent chat history, user info, user picture
Block a User (another user interaction, consider grouping this with messaging) -- JC	
User chooses to block a contact/another user
System will no longer deliver messages from victim.
Messaging -> Austin Marsella
User selects a text box field towards the bottom of their screen.
User types whatever he wants to be communicated to the people in the current group.
User presses Enter, or the on-screen send button, to broadcast their message to the group. 
Message is then broadcasted only within that user’s current group.
Muting/unmuting notifications
Users choose a chat group
User selects mute
System prompts user for silence duration
1 hour, until a certain time, until you wake up next morning, etc…
user will stop receiving notifications from the group chat/chat.
User selects unmute
System unmutes group chat.
user will receive all notifications sent to the group chat/chat.
Archival ->Rebecca
If the user wishes to save a very useful conversation there will be an option to archive the event.
For communal posts and announcements, there will be an option for the right permission group to post in a Announcements chat for everyone to see
This will typically stay around for 30 days or until creator has deleted it themselves
For long term storage of communal posts, there can be a permanent archive
Separate personal archives can exist per user
Space will be limited
Log Out -> Stephanie Meyer
User clicks on “Log Out” button
System prompt asks the user to verify that they want to log out
User selects yes, system proceeds to 9.2
User selects no, user is returned to their last active chat window
System logs out user
Notification is sent to all group chats the member was currently using, notifying that user has logged out of the chat
