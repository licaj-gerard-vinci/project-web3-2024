import React from "react";
import './termsOfUse.css';  // Import the external CSS file

const TermsOfUse = () => {
  return (
    <div className="terms-of-use-container">
      <h1 className="terms-of-use-title">Terms of Use</h1>
      <div className="terms-of-use-content">
        <h2>1. Service Description</h2>
        <p>
          MuscleMap provides an interactive, web-based experience
          where registered users can view a digital representation of the human
          body. By clicking on specific muscles, users are presented with
          information about exercises that may help strengthen or train those
          muscles.
        </p>
        <p>
          <strong>Note:</strong> This service is for informational and
          educational purposes only and should not be treated as professional or
          medical advice.
        </p>

        <h2>2. Age Requirement and User Accounts</h2>
        <p>
          To use our Service, you must:
          <ul>
            <li>Be at least 16 years old.</li>
            <li>Register with accurate and truthful information.</li>
            <li>Use our Service solely for personal and non-commercial purposes.</li>
          </ul>
          You may only have one account on our platform, and we reserve the
          right to delete duplicate accounts. Account security is your
          responsibility, and any activity under your account is deemed
          authorized by you.
        </p>

        <h2>3. Use of the Platform</h2>
        <p>
          The Platform is intended for educational purposes only. By using the
          Platform, you agree to:
          <ul>
            <li>Use the content solely for personal education and fitness exploration.</li>
            <li>
              Avoid using the Platform for commercial, professional, or third-party purposes without our
              explicit permission.
            </li>
            <li>Avoid any malicious or harmful activity, including the introduction of viruses, malware, or unauthorized scripts.</li>
          </ul>
        </p>

        <h2>4. No Medical Advice and Assumption of Risk</h2>
        <p>
          All information provided on the Platform, including exercise
          recommendations, is for educational purposes only and is not a
          substitute for professional medical advice, diagnosis, or treatment.
          We do not take any responsibility if you experience injury or harm as
          a result of following any exercise guidelines found on our Platform.
          Users assume all risk related to the physical activities they engage
          in after using our Service.
        </p>

        <h2>5. User Content and Intellectual Property</h2>
        <p>
          All content on the Platform, including text, graphics, interactive
          features, and code, is owned by MuscleMap or licensed to us.
          You may not reproduce, distribute, modify, or exploit any part of the
          Platform without prior written consent.
        </p>

        <h2>6. Privacy and Data Collection</h2>
        <p>
          For information on how we collect, use, and protect your personal
          data, please refer to our Privacy Policy. By using the Platform, you
          consent to our data practices as described in the Privacy Policy.
        </p>

        <h2>7. Termination of Use</h2>
        <p>
          We reserve the right to terminate or suspend access to your account or
          our Platform at our discretion, particularly if we believe you are
          violating these Terms. You may also terminate your use of the Platform
          by deleting your account.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, MuscleMap, its
          affiliates, and its representatives disclaim all liability for any
          injuries, losses, or damages arising from the use of the Platform,
          including but not limited to:
          <ul>
            <li>Injuries caused by attempting exercises without proper technique or supervision.</li>
            <li>Losses from data breaches, unauthorized access, or service interruptions.</li>
          </ul>
        </p>

        <h2>9. Changes to the Terms of Use</h2>
        <p>
          We reserve the right to update or modify these Terms at any time to
          reflect changes to our practices or for legal reasons. Continued use
          of the Platform after changes are posted signifies your agreement to
          the modified Terms.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of Belgium. Any disputes arising from these Terms
          or your use of the Platform shall be subject to the jurisdiction of
          the courts in Belgium.
        </p>

        <p className="terms-of-use-footer">
          By creating an account or using our Platform, you agree to these Terms
          of Use.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;