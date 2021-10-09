# Project Setup

    1. Create server js and set up express server
    2. Create config file inside config folder and import in server JS uisng dotenv
    3. Create build and prod commands in package JSON
    4. Create db file inside config folder and import in server js (use URI from config)

    5. create router & controller folder for Resource with respective files
    6. All business logic resides inside controller middleware function, create a start up of it for mapping with router
    7. Map the controller inside router file
    8. Mount the router with path in server

    9. Setup Body parser using express json in server JS
    10. Create middleware folder and Setup async middleware to avoid repeated try & next and also handles error 
    11. Create error middleware with Error response class in utlity folder
    12. Use error middleware after mounting the router files

    13. Create schema using mongoose inside model folder and use it in controller middleware for CRUD


<!-- Application Flow -->
Server JS -> Router -> Controller -> DB
