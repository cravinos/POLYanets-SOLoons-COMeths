# Project: POLYanets, SOLoons, COMeths


## Key Design Decisions
- **Rate Limiting**: In the absence of rate-limiting information from the API, the implementation will force the request even in cases of `429 Too Many Requests` responses.
- **Error Handling**: 
  - For non-429 errors occurring during entity creation, the system will retry up to a maximum of 5 times before exiting the runtime environment.
- **Unified Creation and Deletion Logic**:
  - Combined all entity creation logic (POLYanets, SOLoons, COMeths) into a single `createEntity.ts` file.
  - Similarly, deletion logic for these entities has been unified.
- **Verification**: Added an extra verification step at the end. 

---

## How to Run the Application

1. **Install Dependencies**:
```
   npm install
   ```
### Run Full Construction and Verification:

```
npm start
```
This command will fully construct the map and perform verification.

### Run Verification Only:

```
npm run verification
```
This command only runs the verification process. If this is run before npm start, it will construct the correct map as part of the verification.

