/* Seat layout for 10-seat poker table.
 * Each seat is described as percentage of canvas width/height.
 */

export const SEAT_POSITIONS = [
  { xPct: 50, yPct: 68 }, // seat 0 (bottom center)
  { xPct: 30, yPct: 68 }, // seat 1
  { xPct: 10, yPct: 55 }, // seat 2
  { xPct: 10, yPct: 25 }, // seat 3
  { xPct: 30, yPct: 12 }, // seat 4
  { xPct: 50, yPct: 12 }, // seat 5
  { xPct: 70, yPct: 12 }, // seat 6
  { xPct: 90, yPct: 25 }, // seat 7
  { xPct: 90, yPct: 55 }, // seat 8
  { xPct: 70, yPct: 68 }, // seat 9
]

export const SEAT_STATE = {
  ACTIVE: 0,
  AUTOFOLD: 1,
  STAYONTABLE: 2,
  CLEAR: 3,
}

export const ACTION_STRINGS = ['', 'Fold', 'Check', 'Call', 'Bet', 'Raise', 'All-In']

export function getSeatState(playerData) {
  if (!playerData?.gameValues) return SEAT_STATE.CLEAR
  const gv = playerData.gameValues
  if (gv.active) {
    return gv.sessionActive ? SEAT_STATE.ACTIVE : SEAT_STATE.AUTOFOLD
  }
  return gv.stayOnTable ? SEAT_STATE.STAYONTABLE : SEAT_STATE.CLEAR
}

export function computeSeats(canvasWidth, canvasHeight) {
  const sw = canvasWidth * 15 / 100
  const sh = canvasHeight * 20 / 100
  return SEAT_POSITIONS.map(s => ({
    x: canvasWidth * s.xPct / 100 - sw / 2,
    y: canvasHeight * s.yPct / 100 - sh / 2,
    w: sw,
    h: sh,
  }))
}
