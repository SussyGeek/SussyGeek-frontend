import { ArrowLeft, Landmark } from 'lucide-react';
import { Button } from './ui/button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserInstance from './UserInstance';
import { useAuth } from '@/hooks/useAuth';
import { logout as Logout } from '@/api/services/userService';

const Header = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { username, refreshAuth } = useAuth();

  const handleLogout = async () => {
    await Logout();
    await refreshAuth();
  }

  const BrowserInstituionsBtn = (
    { loggedIn }: { loggedIn: boolean }
  ) => (
    <Button variant="outline" className={
      loggedIn ?
        "group hover:pr-2 pl-2 pr-0" :
        "px-2"
    }>
      <Landmark size={14} className={loggedIn ? "" : "relative left-1"} />
      <div className={
        loggedIn ?
          "max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300" :
          ""
      }>Browse</div>
    </Button>
  )

  return (
    <header className="fixed w-full border-b border-white/10 bg-green-200/30 backdrop-blur-lg border-b-2 border-green-800/15 z-50 shadow-lg">
      {
        pathname === '/' ?
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/">
              <img src="./SussyGeek_logo.avif" className="h-[3.5vw] w-[11.5vw]" />
            </Link>

            <div className="flex gap-2">
              {
                username &&
                <UserInstance
                  username={username}
                  handleLogout={handleLogout}
                />
              }

              <Link to="/institutions">
                <BrowserInstituionsBtn
                  loggedIn={username ? true : false}
                />
              </Link>
            </div>
          </div> :
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="mb-2 hover:bg-transparent hover:text-green-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>

              {username &&
                <UserInstance
                  username={username}
                  handleLogout={handleLogout}
                />
              }
            </div>
          </div>
      }
    </header>
  )
}

export default Header;
