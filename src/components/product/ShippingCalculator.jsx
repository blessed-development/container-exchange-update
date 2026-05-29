/* PRODUCT SWITCHER + GRADE DROPDOWN FINAL */

.shipping-calculator-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grade-select-wrap {
  position: relative;
  width: 100%;
  height: 50px;
  border-radius: 16px;
  border: 2px solid rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.08);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.grade-select-check {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: #16a34a;
  stroke-width: 3.5;
  pointer-events: none;
}

.grade-select {
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  appearance: none;
  background: transparent;
  color: hsl(var(--foreground));
  font-size: 14px;
  font-weight: 900;
  padding: 0 44px 0 44px;
  cursor: pointer;
}

.grade-select option {
  color: #111827;
  background: #ffffff;
  font-weight: 700;
}

.grade-select-arrow {
  position: absolute;
  right: 14px;
  width: 18px;
  height: 18px;
  color: #16a34a;
  stroke-width: 3;
  pointer-events: none;
}
