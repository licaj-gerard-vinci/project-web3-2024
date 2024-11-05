// Footer.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Section>
          <Title>Location & Contact</Title>
          <Text><strong>Address:</strong> Pl. de l'Alma 3, 1200 Woluwe-Saint-Lambert</Text>
          <Text><strong>Email:</strong> support@student.vinci.com</Text>
          <Text><strong>Open Hour:</strong> Sun – Thu: Open 24/7</Text>
        </Section>
        
        <Section>
          <Title>Quick Link</Title>
          <List>
            <ListItem>About</ListItem>
            <ListItem>Trainer</ListItem>
            <ListItem>Pricing</ListItem>
            <ListItem>Package</ListItem>
            <ListItem>Contact</ListItem>
          </List>
        </Section>
        
        <Section>
          <Title>Social Link</Title>
          <List>
            <ListItem><FaFacebook /> Facebook</ListItem>
            <ListItem><FaInstagram /> Instagram</ListItem>
            <ListItem><FaLinkedin /> LinkedIn</ListItem>
            <ListItem><FaTwitter /> Twitter</ListItem>
          </List>
        </Section>
        
        <Section>
          <Title>MUSCLEMAP</Title>
          <Text>Press. Train. Transform.</Text>
          <PhoneNumber><FaPhone /> +32 485 39 42 62</PhoneNumber>
        </Section>
      </FooterContent>
      <FooterBottom>
        <Copyright>© Copyright 2024. Developed By Group 13</Copyright>
      </FooterBottom>
    </FooterContainer>
  );
}

export default Footer;

// Footer.js (continued)

const FooterContainer = styled.footer`
background: linear-gradient(to bottom, #0a0a0c, #3f3f3f);
color: #fff;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  text-align: left;
`;

const Section = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  color: #fff;
`;

const Text = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #ddd;
  margin: 5px 0;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  font-size: 14px;
  line-height: 1.6;
  color: #ddd;
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: #ff8c00;
    cursor: pointer;
  }
`;

const PhoneNumber = styled.p`
  font-size: 16px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FooterBottom = styled.div`
  text-align: center;
  padding: 10px;
  border-top: 1px solid #444;
  font-size: 13px;
  color: #888;
`;

const Copyright = styled.p`
  margin: 0;
`;