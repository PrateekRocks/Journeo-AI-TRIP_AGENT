# API Reference

The backend operates over JSON-based REST APIs hosted by FastAPI. 

## 1. Plan a Trip
`POST /api/travel`

Initializes or continues a travel itinerary generation sequence. 
Because the application halts at the **Human Validation** node, this endpoint will typically return a drafted itinerary requiring approval, rather than final completion execution.

**Request Body**
```json
{
  "message": "I want to visit Tokyo for 5 days next week. My budget is 1500 USD.",
  "thread_id": "optional_string_for_continuing_conversations"
}
```

**Common Response (Requires Approval)**
```json
{
  "success": true,
  "thread_id": "user_2f6d826f5...",
  "requires_approval": true,
  "approval_request": "Please review the generated draft itinerary. Approve it...",
  "answer": "Draft itinerary is prepared for your visit to Tokyo...",
  "flight_results": "...",
  "hotel_results": "...",
  "weather_results": "Current Weather: 15°C...",
  "budget_results": "...",
  "itinerary": "### Day 1\n...",
  "guardrail_allowed": true
}
```
*Note: Note that `answer` contains the last known message (often equal to ITINERARY text) when waiting for an interrupt pipeline.*

---

## 2. Approve or Reject Itinerary
`POST /api/travel/approve`

Resumes a parked LangGraph conversation Thread and orchestrates the final AI compilation node based on the user's explicit feedback.

**Request Body**
```json
{
  "thread_id": "user_2f6d826f5...",
  "approved": true,
  "feedback": "Actually, limit the budget to 1200 instead."
}
```
*Note: `feedback` is optional if `approved` is true, but mandatory if `approved` is false.*

**ResponseBody**
```json
{
  "success": true,
  "thread_id": "user_2f6d826f5...",
  "requires_approval": false,
  "answer": "Here is your finalized complete travel plan for Tokyo...",
  "final_response": "..."
}
```

---

## 3. Application Health
`GET /health`

**Response**
```json
{
  "status": "ok",
  "message": "TripMate AI API is running",
  "features": [
    "supervisor_agent",
    "input_guardrail",
    "human_in_the_loop"
  ]
}
```
