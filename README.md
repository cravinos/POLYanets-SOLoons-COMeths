# POLYanets-SOLoons-COMeths

How i visualize the execution flow for the assessment part 1 will flow 

createPolyanet 
will try catch block a post request to /api/polyanets with candiateId & x, y coordinate for the polyanet we want to add to our map

- when response is 200
    we want feedback logging to the user with the coordiante details and change 
- else we want to log the status error message 

catch : 
    thinking of possibly adding max retries as error handling is a req for this project 



call a method x that logs initialization of deployment
    for each coordiante in x shape pattern identified from goal endpoint,
        call client.createX(with coordinates) store resulting promise 
    
   a wait for all promises to resolve 
   feedback that all was complete

   call verify deployment to test values match expected 


   verify deployment method 
    retrieve goal map by calling the get current usermap method 
    for each coordinate in the x shape pattern that is POLYANET
        if map doenst have POLYANET in correct coordinate 
            EG SPACE is in slot of POLYANET
            POLYANET is in slot of SPACE
            log the error 
            possibly add to a redo list incase of rate limiting 
    then log verification complete 