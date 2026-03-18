/* Card path and value utilities */

export function getCardSrcPath(cardValue) {
  if (cardValue === 'flipside') return '/gfx/cards/flipside.png'
  if (cardValue == null) return '/gfx/cards/flipside.png'
  return `/gfx/cards/${cardValue}.png`
}
