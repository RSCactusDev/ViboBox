import { signOut } from "@/config/auth"
 
export function   LogOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Log Out</button>
    </form>
  )
}