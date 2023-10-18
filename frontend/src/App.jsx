import { Button, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import CreatePost from "./components/CreatePost"


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

          <Route path="/update" element={ user ? <UpdateProfilePage /> : <Navigate to="/auth" /> } />

          {/* If user is logged in then only show createpost icon */}
          <Route  path="/:username" element={
            user ? (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <Navigate to="/auth"  />
            )
          } />
          <Route  path="/:username/post/:pid" element={<PostPage />} />
        </Routes>

        

      </Container>
  )
}

export default App
