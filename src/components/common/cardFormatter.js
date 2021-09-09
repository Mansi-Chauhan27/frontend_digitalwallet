export function CardFormatter(card_number){
    return card_number.toString().substring(0, 4) + "-" + card_number.toString().substring(4,8) + "-" + card_number.toString().substring(8,12) + "-" + card_number.toString().substring(12)
}