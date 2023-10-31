import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import app from "../firebase";

const initialUserData = localStorage.getItem("userData") ? 
  JSON.parse(localStorage.getItem("userData")) : {};

const NavBar = () => {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialUserData);

  const listner = () => {
    if(window.scrollY > 50) {
      setShow(true);
    } else {
      setShow(false)
    }
  }

  useEffect(() => {
    // unsubscribe()를 리턴함
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log("user", user);
      if (!user) {
        // 비로그인시
        navigate("/login");
      } else if (user && pathname === "/login") {
        navigate("/");
      } else {
      }
    });
    // 해당 컴포넌트가 사용안될때 제거할때
    return () => {
      unsubscribe();
    };
  }, [pathname])
  
  useEffect(() => {
    window.addEventListener("scroll", listner);  
    return () => {
      window.removeEventListener("scroll", listner)
    }
  }, [])
  

  // sign-in
  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then(result => {
        setUserData(result.user)
        localStorage.setItem("userData", JSON.stringify(result.user))
      })
      .catch(error => {
        console.error(error);
      })
  }

  // sign-out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUserData({});
      })
      .catch(error => {
        alert(error.massage);
      })
  }

  return (
    <NavWrapper show={show}>
      <Logo>
        <Image
          alt="Pokemon Logo"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          onClick={() => (window.location.href = "/")}
        />
      </Logo>
      {pathname === '/login' ? (
        <Login onClick={handleAuth}>로그인</Login>
      ) : (
        <SignOut>
          <UserImg 
            src={userData.photoURL} 
            alt="" 
          />
          <DropDown onClick={handleSignOut}>로그아웃</DropDown>
        </SignOut>
      )}
    </NavWrapper>
  );
}

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left:0;
  right:0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 36px;
  letter-spacing: 16px;
  z-index: 100;
  background: ${props => props.show ? "#090b13": "transparent"};
`
const Logo = styled.a`
  padding: 0;
  width: 50px;
  margin-top: 4px;
`
const Image = styled.img`
  cursor: pointer;
  width: 100%;
`

const Login = styled.a`
  background: rgba( 0, 0, 0, .6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.55px;
  border: 1px solid #f9f9f9;
  color: #f9f9f9;
  border-radius: 4px;
  transition: all .2s ease 0s;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`

const DropDown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0 0 18px 0;
  padding: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
  color: #fff;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  &:hover {
    ${DropDown} {
      opacity: 1;
      transition: 1s;
    }
  }
`
const UserImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`


export default NavBar