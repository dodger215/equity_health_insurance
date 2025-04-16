
import { useState, useRef, useEffect } from "react"
import styles from "./abs/calculator.module.css"

const Select = ({ id, label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value) || options[0]

  return (
    <div className={styles.selectContainers}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div 
        className={styles.customSelect} 
        ref={selectRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.selectHeader}>
          {selectedOption.label}
          <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && (
          <div className={styles.selectOptions}>
            {options.map((option) => (
              <div
                key={option.value}
                className={`${styles.option} ${value === option.value ? styles.selectedOption : ""}`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Select