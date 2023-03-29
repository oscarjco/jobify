import React from "react";
import { Link } from "react-router-dom";
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingWrapper";
import { Logo } from "../components";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> App
          </h1>
          <p>
            I'm baby single-origin coffee copper mug irony butcher. Cliche pug
            man braid sus green juice raclette brunch salvia letterpress four
            loko mustache meggings swag iPhone. Chia +1 normcore, cred messenger
            bag vape fixie tumblr four loko organic. Poke portland retro 8-bit
            hashtag coloring book drinking vinegar artisan tattooed schlitz
            ascot banjo.
          </p>
          <Link to='/register' className="btn btn-hero">Login/Register</Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
