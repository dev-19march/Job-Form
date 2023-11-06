import React from 'react';
import styles from '../css/ResponsePage.module.css';

function RespondPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.header}>Thank You for Your Response</h1>
        <p className={styles.description}>
          We appreciate your submission. Your response has been received.
        </p>
        <p className={styles.description}>
          Thank you for taking the time to provide us with your information. If
          you have any further questions or need assistance, please feel free to
          contact us.
        </p>
      </div>
    </div>
  );
}

export default RespondPage;
