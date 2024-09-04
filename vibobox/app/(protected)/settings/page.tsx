import { auth } from "@/config/auth"
import { LogOut } from "@/components/logout-button"


const Settings = async () => {
  const session = await auth()
  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      <div><LogOut /></div>
    </div>
    
  )
}

export default Settings