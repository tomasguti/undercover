import styles from './button.module.css'

export default function Button({ children, ...props }) {
  return (
    <div { ...props } className={styles.button}>
      { children }
    </div>
  )
}
