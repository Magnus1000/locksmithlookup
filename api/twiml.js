module.exports = (req, res) => {
    const twiml = new Twilio.twiml.VoiceResponse();
  
    twiml.say('Connecting your call, please wait.');
    // Add other call instructions here, such as `<Dial>` if needed
  
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
};
  