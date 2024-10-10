function availableTickets(trip){
    return trip.total_capacity-trip.booked_by.length
}

module.exports=availableTickets