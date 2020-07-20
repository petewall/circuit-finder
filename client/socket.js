const socket = io()
socket.on('connect', () => {
  $('#state').text('ON')
  $('body').addClass('connected')
})
socket.on('connect_error', (error) => {
  $('#state').text('OFF')
  $('body').removeClass('connected')
})
