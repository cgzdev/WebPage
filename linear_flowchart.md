# Linear Flowchart - Top Right to Bottom Left

## Simple Linear Flow

```
START
  ↓
┌─────────────────────────────────────────────────────────────┐
│                    MAIN PAGE                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   EMAIL     │  │ FIELD TYPE  │  │   INPUT     │        │
│  │   INPUT     │→ │ SELECTION   │→ │ VALIDATION  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 PHOTO SELECTOR PAGE                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   HEADER    │  │   GALLERY   │  │   COUNTER   │        │
│  │   DISPLAY   │→ │   LOADING   │→ │   UPDATE    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  USER INTERACTIONS                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   PHOTO     │  │   SELECT    │  │   VISUAL    │        │
│  │   CLICK     │→ │   TOGGLE    │→ │   FEEDBACK  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   ACTION BUTTONS                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   SELECT    │  │    SEND     │  │    BACK     │        │
│  │    ALL      │→ │ SELECTION   │→ │ NAVIGATION  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  PROCESSING & RESULTS                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ VALIDATION  │  │   SERVER    │  │   SUCCESS   │        │
│  │   CHECK     │→ │   REQUEST   │→ │   MESSAGE   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              ↓
                              END
```

## Detailed Flow Steps

### **Phase 1: Entry & Input (Top)**
1. **Email Input** → User enters email address
2. **Field Selection** → Choose generation or group type
3. **Input Validation** → System validates and parses input (supports: 2027, 27, g27, g2027, gen27, gen2027)

### **Phase 2: Page Transition (Upper Middle)**
4. **Header Display** → Shows generation/group title
5. **Gallery Loading** → Fetches photos from server
6. **Counter Setup** → Initializes photo counter

### **Phase 3: User Interaction (Middle)**
7. **Photo Click** → User selects individual photos
8. **Selection Toggle** → Photos are marked as selected
9. **Visual Feedback** → Selected photos get grey overlay

### **Phase 4: Actions (Lower Middle)**
10. **Select All** → Bulk selection/deselection
11. **Send Selection** → Submit selected photos
12. **Back Navigation** → Return to previous page

### **Phase 5: Processing (Bottom)**
13. **Validation Check** → Ensure photos are selected
14. **Server Request** → Send data to backend
15. **Success Message** → Confirm completion

## Visual Flow Representation

```
📧 → 📋 → ✅ → 🖼️ → 👆 → 📊 → 🔄 → 📤 → ⬅️ → ⚙️ → 📧 → ✅ → 🏁
 │    │    │    │    │    │    │    │    │    │    │    │    │
 │    │    │    │    │    │    │    │    │    │    │    │    └── END
 │    │    │    │    │    │    │    │    │    │    │    └────── Success
 │    │    │    │    │    │    │    │    │    │    └───────── Server
 │    │    │    │    │    │    │    │    │    └──────────── Validation
 │    │    │    │    │    │    │    │    └───────────────── Back
 │    │    │    │    │    │    │    └──────────────────── Send
 │    │    │    │    │    │    └───────────────────────── Select All
 │    │    │    │    │    └────────────────────────────── Counter
 │    │    │    │    └─────────────────────────────────── Interaction
 │    │    │    └──────────────────────────────────────── Gallery
 │    │    └───────────────────────────────────────────── Validation
 │    └────────────────────────────────────────────────── Field Type
 └─────────────────────────────────────────────────────── Email
```

## Key Decision Points

### **Input Validation Branch**
```
Valid Input → Continue to Photo Selector
Invalid Input → Show Error → Return to Input
```

### **Photo Selection Branch**
```
Photos Selected → Continue to Send
No Photos Selected → Show Error → Return to Selection
```

### **Navigation Branch**
```
Send → Process and Complete
Back → Return to Main Page
```

This linear flow shows the natural progression from user entry at the top-right through the complete interaction process to completion at the bottom-left, with clear decision points and feedback loops.
