import React from 'react'
import styles from "./AnnouncementBar.module.css";


function AnnouncementBar() {
  return (
    <div className={styles.announcementBarContainer}>
      <p>Note: The initial data may take a few moments to load due to API rate limits. Thank you for your patience.</p>
    </div>
  )
}

export default AnnouncementBar