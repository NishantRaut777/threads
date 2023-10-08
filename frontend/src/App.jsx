import { Button, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"
import LogoutButton from "./components/LogoutButton"


function App() {
    // get the user state value from userAtom
    const user = useRecoilValue(userAtom);

    return (
      <Container maxW="620px">
        <Header />
        <Routes>
          {/* If user exists then render Homepage else navigate to AUTH page */}
          <Route path="/" element={ user ? <HomePage /> : <Navigate to="/auth" /> } />

          {/* If user exixts go to home page else go to AUTH page  */}
          <Route path="/auth" element={ !user ?  <AuthPage />: <Navigate to="/" /> } />

          <Route  path="/:username" element={<UserPage />} />
          <Route  path="/:username/post/:pid" element={<PostPage />} />
        </Routes>

        {user && <LogoutButton />}
      </Container>
  )
}

export default App
