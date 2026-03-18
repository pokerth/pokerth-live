/* Card path and value utilities */

const CARD_SIZES = [50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290]

function getCardSizeForHeight(canvasHeight) {
  const cardHeight = Math.round(canvasHeight * 12.67 / 100)
  for (const s of CARD_SIZES) {
    if (cardHeight <= s) return s
  }
  return 290
}

export function getCardSrcPath(cardValue, canvasHeight) {
  if (cardValue === 'flipside' || cardValue == null) return 'gfx/cards/flipside.png'
  const size = canvasHeight ? getCardSizeForHeight(canvasHeight) : 170
  return `gfx/cards/${cardValue}_${size}px.png`
}
