# Sprint Planner

## Dependency Packages:

Main dependencies:

npm i express socket.io moment

npm i -D ts-node typescript @types/express @types/node @types/moment @types/socket.io

```shell
npm i express mongoose connect-mongo express-session express-handlebars dotenv method-override moment morgan passport passport-google-oauth20
```

Dev dependencies:

```shell
npm i -D nodemon cross-env
```

TypeScript types:

```shell
 npm i -D @types/express @types/mongoose @types/connect-mongo @types/express-session @types/express-handlebars @types/dotenv @types/method-override @types/moment @types/morgan @types/passport @types/passport-google-oauth20
```

## Future enhancements:

// Allow users to paste full url to Join input section on the home screen and strip out the rest os the url automatically leaving only the room ID.

// Switch all inputs on home page and join page to be wrapped with a form so that the buttons could be activated with a return/enter key press

// Replace toastify with Materialize toast

// Figure out to add a way to prevent users joining by opening bunch of new tabs. One of the solutions could be asking for unique username instead/in addition to name. Another solution could be providing a way for the moderator to set/specify which users are allowed to join. Then it would probably require asking moderator for those user names, and creating separate URL's for each user. Explore options...

// Add server side and client side input validation

// Make app responsive on mobile

// Look into options for generating unique IDs on server side instead of generating them on client side

// Persist user name into local storage in order to prevent the user to provide name again after page is refreshed, to join a room

// See if you need to delete rooms from Rooms object on the server (probably yes!). Otherwise, the unused and unaccessible rooms will keep piling up in server memory

// Find a way to intead of sending roomData with every update, to just send specific updates based on whatever is happening. For example, for voting sessions, maybe just emiting and listening on currentSession object.

// See if you can use only one state/status for room. For example, decide which components need to ask how depending on just one status - roomStatus.... instead of also depending on currentSession.active...

// Style the way it looks when you share a link with room ID in slack. Make it look nice, having maybe name of the room etc

// Disable Join button when no name has been provided and wrap it with a form to allow tabbing and Enter

// Persist choice of theme to localStorage

// Add some conditions on server side to limit up to a certain number of rooms/users etc to not overload the server

// Add forever or whatever the other one is called.. to restart the server everytime it crushes

// Copy some of the error handling functionality from travel portal node server

## Progress
