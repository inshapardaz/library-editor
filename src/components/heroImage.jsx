// Internal Imports
import styles from '../styles/common.module.scss'

// -----------------------------------------------

function HeroImage({ useStaticImage = false, size = 'large', children }) {
    return (<div className={styles.hero} style={{
        backgroundImage: (useStaticImage ? 'url(/images/home_background.jpg)' : 'url(https://source.unsplash.com/1600x900/?library,books)')
      }}
      data-ft="hero-image"
    >
      <div className={styles.hero__background} >
          {children}
      </div>
    </div>);
}

export default HeroImage;
