### Plan:

1. **User Profile Management**:
   - Create a new route to fetch user details.
   - Implement a route to update user information (username, email).

2. **Auction Status Updates**:
   - Add functionality to close auctions after a certain period or when a bid is placed.
   - Create a route to fetch closed auctions.

3. **Bid History**:
   - Implement a route to fetch the bidding history for each auction.
   - Store bid history in the auction model.

4. **Notifications**:
   - Set up a basic notification system to inform users when they are outbid.
   - Create a route to fetch user notifications.

5. **Testing**:
   - Ensure all new routes are tested for proper functionality.
   - Validate that the frontend can interact with the new backend features.

### Dependent Files to be Edited:
- `backend2/server.js`: To add new routes and functionalities.
- Potentially update the `Frontend/src/services/api.js` to include new API calls for the added features.

### Follow-up Steps:
- Verify the changes in the backend.
- Confirm with the user for any additional requirements or modifications.
