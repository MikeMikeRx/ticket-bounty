# Ticket Bounty

![tickets-page](./screenshots/Ticket-Bounty.png)

---

Ticket Bounty is a full-stack ticket management platform where users post tasks or issues with a monetary bounty attached. The idea is simple: describe a problem, set a deadline and a reward (the "bounty"), and track its progress until it's resolved.

**Live Demo**: [View on Vercel](https://ticket-bounty-seven.vercel.app/)


## Key Highlights

- Custom session-based authentication (no third-party auth provider)
- Ownership-based authorization pattern
- Server Actions + Zod validation
- End-to-end TypeScript
- Clean feature-based architecture


## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma v7 with native pg adapter |
| **Authentication** | Custom session-based auth |
| **Password Hashing** | Argon2 |
| **Validation** | Zod v4 |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Shadcn UI (Radix UI primitives) |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Theme** | next-themes |
| **Date Handling** | date-fns + react-day-picker |
| **URL State** | nuqs |
| **Currency** | big.js |


## How It Works

1. **Sign up / Sign in** — Create an account with a username, email, and password. Sessions are stored in the database and managed via HTTP-only cookies. Forgot your password? Request a reset link by email.

2. **Browse tickets** — The home page lists all tickets publicly. Filter by title, sort by date or bounty size, and paginate through results. No login required.

3. **Create a ticket** — Authenticated users can open the "My Tickets" view and submit a new ticket with a title, description, status, deadline, and bounty amount (stored in cents for precision).

4. **Manage your tickets** — Owners can edit ticket details or update the status (Open → In Progress → Done) from a dropdown. Destructive actions require confirmation.

5. **Comment on tickets** — Any authenticated user can add comments to a ticket detail page. Comments load with offset-based pagination and a "Load More" button. New comments appear instantly via client-side state — no full page reload. Owners can delete their own comments.

6. **Account settings** — Users have a profile page and a password management page, accessible from the account dropdown in the header.

## Architecture Decisions

### Authentication Flow
1. User signs up/in with credentials
2. Password hashed with Argon2
3. Session created in database (30-day TTL)
4. Session ID stored in HTTP-only cookie
5. `getAuth()` validates session on each request
6. Forgot password: reset token emailed, validated server-side, session invalidated on change

### Authorization Pattern
- **UI Layer**: Hide edit/delete buttons for non-owners
- **Server Actions**: Check `isOwner()` before mutations
- **Query Layer**: `isOwner` flag attached at query time, not in components
- **Layout Guards**: Protected routes redirect if unauthenticated

### ActionState Pattern
```typescript
type ActionState<T = any> = {
  status?: "SUCCESS" | "ERROR"
  message: string
  payload?: FormData    // Preserve values on error
  fieldErrors: Record<string, string[]>
  timestamp: number     // Watched by useActionFeedback to fire onSuccess/onError
  data?: T              // Typed return value passed back from the server action
}
```

## Run Locally

**Prerequisites**: Node.js 18+, PostgreSQL (or Supabase)

```bash
git clone https://github.com/MikeMikeRx/ticket-bounty
cd ticket-bounty
npm install

# .env
DATABASE_URL="postgresql://..."

npx prisma migrate dev
npx prisma db seed   # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run dev       # development
npm run build     # production build
npm run type      # TypeScript check
npm run lint      # ESLint
npx prisma studio # database GUI
```

---

## Database Schema

```prisma
model User {
  id           String    @id @default(cuid())
  username     String    @unique
  email        String    @unique
  passwordHash String
  sessions     Session[]
  tickets      Ticket[]
  comments     Comment[]
}

model Session {
  id        String   @id
  expiresAt DateTime
  userId    String
  user      User     @relation(onDelete: Cascade)
}

model Ticket {
  id        String       @id @default(cuid())
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  title     String
  content   String       @db.VarChar(1024)
  status    TicketStatus @default(OPEN)
  deadline  String
  bounty    Int          // Stored in cents
  userId    String
  user      User         @relation(onDelete: Cascade)
  comments  Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  content   String   @db.VarChar(1024)
  ticketId  String
  ticket    Ticket   @relation(onDelete: Cascade)
  userId    String?
  user      User?    @relation(onDelete: SetNull)
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  DONE
}
```