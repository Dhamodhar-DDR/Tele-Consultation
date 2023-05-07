import React from 'react';
import { useNavigate } from 'react-router-dom';

import './PreHome2.css'

function Page2() {
  const nav = useNavigate();
  const nav_doc_login = () => {nav('/login_doc')}
  const nav_pat_login = () => {nav('/login_p')}
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const sectionId = link.getAttribute('href');
      const section = document.querySelector(sectionId);
      section.scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  return (
  <div>
    {/* <div className="button-container">
      <button className="pg1-button" id="doctor" onClick={nav_doc_login}>Doctor Login</button>
      <button className="pg1-button" id="patient" onClick={nav_pat_login}>Patient Login</button>
    </div> */}

    <nav class="pre-navbar">
      <ul class="pre-navbar-nav">
        <li class="pre-nav-item">
          <a href="#home" class="nav-link"><span>Home</span></a>
        </li>
        <li class="pre-nav-item">
          <a href="#about" class="nav-link">About</a>
        </li>
        <li class="pre-nav-item">
          <a href="#services" class="nav-link">Departments</a>
        </li>
        <li class="pre-nav-item">
          <a href="#contact" class="nav-link">Contact</a>
        </li>
      </ul>
    </nav>

    <section id="home">
      <button className="pg1-button" id="doctor" onClick={nav_doc_login}>Doctor Login</button>
      <button className="pg1-button" id="patient" onClick={nav_pat_login}>Patient Login</button>
    </section>    

    <section id="about">
      <div class="about-container">
        <div class="about-text">
          <h2>About us</h2>
          <p>
            Welcome to our teleconsulting website! We are committed to offering our patients high-quality healthcare services in the convenience of their own homes. Medical advice, diagnosis, and treatment are available from our team of skilled and caring healthcare specialists for a variety of health issues. No matter where they live or how mobile they are, everyone should have access to high-quality healthcare, according to our teleconsulting website. With the help of our teleconsulting services, you may communicate with medical specialists whenever and wherever you are in the world. We employ the most recent technology to make sure that your personal information is always secure and are dedicated to upholding the highest standards of patient confidentiality and privacy.
          </p>
        </div>
      </div>
    </section>


    <section id="services">
      <h2>Departments</h2>
      <div class="grid-container">
        <div class="grid-item">
          <i class="fas fa-code"></i>
          <h3>Nuerology</h3>
          <p>Neurology is a medical specialty that deals with the diagnosis and treatment of conditions related to the brain, spinal cord, and nervous system.</p>
        </div>
        <div class="grid-item">
          <i class="fas fa-paint-brush"></i>
          <h3>Cardiology</h3>
          <p>Cardiology is the branch of medicine that deals with the diagnosis, treatment, and prevention of conditions related to the heart and blood vessels.</p>
        </div>
        <div class="grid-item">
          <i class="fas fa-mobile-alt"></i>
          <h3>General Medicine</h3>
          <p>General Medicine is the branch of medicine that focuses on the diagnosis, treatment, and prevention of diseases and disorders affecting adults.</p>
        </div>
        <div class="grid-item">
          <i class="fas fa-search"></i>
          <h3>Dermatology</h3>
          <p>Dermatology is the branch of medicine that deals with the diagnosis and treatment of conditions related to the skin, hair, and nails.</p>
        </div>
        <div class="grid-item">
          <i class="fas fa-chart-line"></i>
          <h3>Gynecology</h3>
          <p>Gynecology is the branch of medicine that deals with the health of the female reproductive system, including the diagnosis and treatment of reproductive disorders and diseases.</p>
        </div>
        <div class="grid-item">
          <i class="fas fa-shopping-cart"></i>
          <h3>Orthopedic</h3>
          <p>Orthopedic medicine is the branch of medicine that focuses on the diagnosis, treatment, and prevention of injuries and disorders affecting the musculoskeletal system, including bones, muscles, joints, tendons, and ligaments.</p>
        </div>
      </div>
    </section>


    <section id="contact">
      <h2>Contact Us</h2>
      <p class="contact-us-text">We're always happy to hear from you!</p>
      <div class="contact-boxes">
        <div class="contact-box">
          <h3>Address</h3>
          <p>IIITB, EHRC LAB</p>
        </div>
        <div class="contact-box">
          <h3>Phone</h3>
          <p>+91 7337088565</p>
        </div>
        <div class="contact-box">
          <h3>Email</h3>
          <p>contact@teleconsult.com</p>
        </div>
        <div class="contact-box">
          <h3>Website</h3>
          <p>www.teleconsult.com</p>
        </div>
      </div>
    </section> 


  </div>
  );
}

export default Page2;