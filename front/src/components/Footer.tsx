import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 2rem 0;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const FooterText = styled.p`
  color: #6c757d;
  margin: 0.5rem 0;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>© 2024 코칭실 예약 시스템. All rights reserved.</FooterText>
        <FooterText>문의: support@coaching.com</FooterText>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
