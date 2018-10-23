  // 1. Text strings =====================================================================================================
  //    Modify these strings and messages to change the behavior of your Lambda function

  const languageStrings = {
      'en': {
          'translation': {
              'WELCOME' : "Hie there, Mr pal.",
              'TITLE'   : "Mr Pal",
              'HELP'    : "This is an adventure game, where you are mr pal is an astronaut at space g, you are on the mission to save the world from planet pluto. Are you ready to start?.",
              'STOP'    : "Okay, play again soon.",
              'VERSION' : "Version: 1.00v"
          }
      }
      // , 'de-DE': { 'translation' : { 'WELCOME'   : "Guten Tag etc." } }
  };
  const data = {
    // TODO: Replace this data with your own.
      "Welcome" :
      [
          '<say-as interpret-as="interjection">Hello</say-as>.',
          '<say-as interpret-as="interjection">Howdy</say-as>.',
          '<say-as interpret-as="interjection">Welcome Back</say-as>.',
          '<say-as interpret-as="interjection">Good day</say-as>.',
          '<say-as interpret-as="interjection">Glad to see you again</say-as>.'
          ],
      "wmsg" :
      [
          'Hello. ',
          'Howdy. ',
          'Welcome Back. ',
          'Good day. ',
          'Glad to see you again. '
          ],
      "congrats" :
      [
          '<say-as interpret-as="interjection">Awesome</say-as>.',
          '<say-as interpret-as="interjection">fantastic</say-as>.',
          '<say-as interpret-as="interjection">hurray</say-as>.',
          '<say-as interpret-as="interjection">well done</say-as>.',
          '<say-as interpret-as="interjection">woo hoo</say-as>.',
          '<say-as interpret-as="interjection">yippee</say-as>.',
          ],
      "congratsmsg" :
      [
          'Awesome',
          'Fantastic',
          'Hurray',
          'well done',
          'woo hoo',
          'Yippee nice '
          ],
      "nextlevel" :
      [
          ' You have made it to level ',
          ' Next level is ',
          ' Your next challenge is level ',
          ' You moved to level ',
          ' You have reached level '
          ]
  };
  const challenges = {
      "questions" :
      [
        //level 1 starts here.
        
          "Which star is at the center of our Solar System?",
          "How much seconds does sun rays take to reach earth?",
          "Which planet is nearest to the sun?",
          "Which planet is known as the Morning Star or the Evening Star?",
          
          //level 2 starts here
          
          "The first spaceship which carried three American astronauts to land two of them on the moon?",
          "The first country to send man to the moon?",
          "The first space-vehicle to orbit the moon?",
          "Name India's first scientific satellite?",
          
          //level 3 starts here
          
          "Which is the coldest and smallest of all planets?",
          "Which Star is called Earth’s satellite?",
          "What is the Orbital period of Moon?",
          "When was the first man made object sent into space?"
          ],
          
          "answers" :
          [
            //level 1
            
            "sun",
            "8",
            "mercury",
            "venus",
            
            //level 2
            
            "apollo",
            "united states of america",
            "luna",
            "aryabhatta",
            
            //level 3
            
            "pluto",
            "moon",
            "27 days",
            "1957"
          
            ],
            "qdisplay" :
            [
              //level 1 starts here.
        
          "Which star is at the center of our Solar System?",
          "How much seconds does sun rays take to reach earth?",
          "Which planet is nearest to the sun?",
          "Which planet is known as the Morning Star or the Evening Star?",
          
          //level 2 starts here
          
          "The first spaceship which carried three American astronauts to land two of them on the moon?",
          "The first country to send man to the moon?",
          "The first space-vehicle to orbit the moon?",
          "Name India's first scientific satellite?",
          
          //level 3 starts here
          
          "Which is the coldest andsmallest of all planets?",
          "Which Star is called Earth’s satellite?",
          "What is the Orbital period of Moon?",
          "When was the first man made object sent into space?"
              ]
            
  };
  const welcomeCardImg = {
      smallImageUrl: '',
      largeImageUrl: ''
  };
  // 2. Skill Code =======================================================================================================

  const Alexa = require('alexa-sdk');
  const AWS = require('aws-sdk');  // this is defined to enable a DynamoDB connection from local testing
  const AWSregion = 'us-east-1';   // eu-west-1
  var persistenceEnabled;
  AWS.config.update({
      region: AWSregion
  });

  exports.handler = function(event, context, callback) {
      var alexa = Alexa.handler(event, context);
      // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
      alexa.dynamoDBTableName = 'Mr_pal'; // creates new table for session.attributes
      if (alexa.dynamoDBTableName == 'Mr_pal' ){
        persistenceEnabled=true;
      } else {
        persistenceEnabled=false;
      }
      alexa.resources = languageStrings;
      alexa.registerHandlers(handlers);
      alexa.execute();

  };

  var say ="",display="";
  var highScore, currentScore, level, i, l, q, back=0, newp;
  
  const handlers = {
      'LaunchRequest': function () {

          this.attributes['highScore'];
          this.attributes['answer'];
          this.attributes['level'];
          say="";
          level =1;
          highScore=0;
          currentScore=0;
          newp=1;
          
          if (!this.attributes['highScore'] ) {
            
            back = newp;
            say = this.t('WELCOME') + ' ' + this.t('HELP');

            this.response.cardRenderer(this.t('TITLE'), this.t('WELCOME') +"\n" + this.t('HELP'), welcomeCardImg);
          } 
          else if(back==1){
            say = 'Here are your Options. 1. Continue your previous game. 2. Start a new game. 3. reset. 4. Updates to know about updates. 5. To send us feedback.';
            display = "High score = " + this.attributes['highScore'] + "\nPlease select your option.\n 1. Continue your previous game.\n 2. start new game.\n 3. Reset\n 4. Updates\n 5. Feedback. ";

            this.response.cardRenderer(this.t('TITLE'), display);
          }
          else {
            back=1;
            highScore = this.attributes['highScore'];
            currentScore=highScore;
            
            level = this.attributes['level'];
            
            i = randomSelect(5);
              say = data.Welcome[i] + ' Your High Score is '
                  + this.attributes['highScore']
                  + '. What you want to do? Here are your Options. 1. Continue your previous game. 2. Start a new game. 3. reset. 4. Updates to know about updates. 5. To send us feedback.';
              display = "High score = " + this.attributes['highScore'] + "\n" + data.wmsg[i] + "\nPlease select your option.\n 1. Continue your previous game.\n 2. start new game.\n 3. Reset\n 4. Updates\n 5. Feedback. ";

              this.response.cardRenderer(this.t('TITLE'), display);
          }
          this.response.speak(say).listen(say);
          this.emit(':responseReady');
      },
      
      'PlayIntent': function () {
          
          i=randomSelect(6);
          this.attributes['level']=level;
        if(level==1){
          q=0;
          l=1;
          say = "Today morning Scientist have observed a small change in the path of pluto."+
          " The scientists and engineers working at space g believe that this change is dangerous to our solar system,"+
          " and we will have to understand the problem and calculate the time left with us."+
          " Mr. pal as a great astronaut is asked to help them answering few questions. Question 1.  " + challenges.questions[q];
          display= "Problem detected in planet pluto.\n Question: \n" + challenges.qdisplay[q];
          this.response.cardRenderer('Your score = ' + currentScore, "\n" + display);
        }
       else if(level==2){
         
          q++;
          l=1;
          say = data.congrats[i]+". "+data.nextlevel[i]+" According to the calculations, Space g Scientist and engineers believe that we have approximately 10 months left"+
          " for planet pluto to hit neptune and so on detroy our complete solar system."+
          " To stop this we need to destroy planet pluto before it hits neptune and so we need to send someone there in a special"+
          " type of space craft. As you are one of the best astronaut in space g, we request you to help us.  Question 1. "+ challenges.questions[q];
          display= "Theme the plan.\n Question: \n" + challenges.qdisplay[q];
          this.response.cardRenderer('Your score = ' + currentScore, "\n" + display);
        }
        else if(level==3){
          
          q++;
          l=1;
          say = data.congrats[i]+". "+data.nextlevel[i]+"Help our engineers to build the space craft. By answering few questions to them. Question 1. "+ challenges.questions[q];
          display= " Build Space Craft. \n Question: \n" + challenges.qdisplay[q];
          this.response.cardRenderer('Your score = ' + currentScore, "\n" + display);
        }
        else if(level==4){
          
          q=13;
          l=1;
          say = data.congrats[i]+". "+data.nextlevel[i]+" Help our Scientists to build a Space path for you. Question 1. "+ challenges.questions[q];
          display= "Design Space Path. \n Question: \n" + challenges.qdisplay[q];
          this.response.cardRenderer('Your score = ' + currentScore, "\n" + data.congratsmsg[i] + "\n" + display);
        }
        /*else if(level==5){
          
          q=17;
          l=1;
          say = " The space craft is built and will be launched next morning. Prepare yourself. Question 1. "+ challenges.questions[q];
          display= "Prepare to launch. \n Question: \n" + challenges.qdisplay[q];
          this.response.cardRenderer('Your score = ' + currentScore, "\n" + data.congratsmsg[i] + "\n" + display);
        }
        else if(level==6){
          
          q=51;
          l=1;
          say = " Halt at space station 1. Collect information at Mars. Question 1. "+ challenges.questions[q];
          display= "Halt Space Station Mars. \n Question: \n" + challenges.qdisplay[q];
          this.response.cardRenderer('Your score = ' + currentScore, "\n" + data.congratsmsg[i] + "\n" + display);
        }
        else if(level==7){
          
          q=61;
          l=1;
          say = " Halt at space station 2. Collect information near Ceres. Question 1. "+ challenges.questions[q];
          display= "Halt Space Station Ceres. \n Question: \n" + challenges.qdisplay[q];
          this.response.cardRenderer('Your score = ' + currentScore, "\n" + data.congratsmsg[i] + "\n" + display);
        }
        else if(level==8){
          
          q=71;
          l=1;
          say = " Halt at space station 3. Collect information at Saturn Question 1. "+ challenges.questions[q];
          display= "Saturn Crysis. \n Question: \n" + challenges.qdisplay[q];
          this.response.cardRenderer('Your score = ' + currentScore, "\n" + data.congratsmsg[i] + "\n" + display);
        }*/
        else{
            this.emit('CompletedIntent');
        }
        
        this.response.speak(say).listen(say);
        
        this.emit(':responseReady');
      },
      
      'BlankIntent': function() {
        
        this.response.cardRenderer(this.t('TITLE'), "\n No. | Question \n" + l + ".       " + challenges.qdisplay[q]);
        this.response.speak("Please tell me your answer ? Your question is "+ challenges.questions[q]).listen("Please tell me your answer?");
        
        this.emit(':responseReady');
      },
      
      'UpdateIntent': function () {
        back=newp;
        newp=2;
        display="1. Updated Questions display.\n 2. Updated the voice UI.\n3. Added Column to questions. \n4. Improved Voice Navigation. \n5. Added back navigation in menu."
        +"\n Ask back to go back.";
        
        say="Number 1. Updated Questions on display. Number 2. Updated the voice UI. Number 3. Added new questions. Number 4. Improved Voice Navigation. 5. Added back navigation. "
        +"\n To back to previous menu just say back.";
        
        this.response.cardRenderer(this.t('VERSION'), display);
        this.response.speak(say).listen(say);
        
        this.emit(':responseReady');
      },
      
      'BackIntent': function () {
        if(back==1)
        {
          this.emit('LaunchRequest');
        }
        else if(back==2)
        {
          this.emit('UpdateIntent');
        }
        else
        this.emit('FeedbackIntent');
        
      },
      
      'FeedbackIntent': function () {
        back=newp;
        newp=3;
        
        display="Please send me feedback at: vvksindia@gmail.com. "
        +"\n Ask me back to back to previous menu.";
        
        say='Connect directly to me. Please drop me an email at <say-as interpret-as="spell-out">vvksindia@gmail.com</say-as>. for any kind of update. '
        +"\nJust ask back to to go back.";
        
        this.response.cardRenderer(this.t('VERSION'), display);
        this.response.speak(say).listen(say);
        
        this.emit(':responseReady');
      },
      
      'CompletedIntent': function () {
          
        highScore = incrementScore.call(this, currentScore);
        
        i=randomSelect(6);
        say += data.congrats[i] + ". you have completed the game! Your Highscore is " + highScore + "bye bye.";
        display += data.congratsmsg[i] + ". you have completed the game! Your Highscore is " + highScore + "bye bye.";
        
        this.response.cardRenderer(this.t('TITLE'), display);
        this.response.speak(say).cardRenderer(this.t('TITLE'), data.congratsmsg[i] + "\n You have completed all the challenges! New mission coming soon.", welcomeCardImg); 
        this.emit(':responseReady');
      },
      
      'StartPlaying': function () {
        
        level = 1;
        highScore=0;
        currentScore=0;
        this.emit('PlayIntent');
      },
      
      'ContinuePlaying':function(){
        
        level = this.attributes['level'];
        highScore = this.attributes['highScore'];
        currentScore=highScore;
        this.emit('PlayIntent');
      }, 
      
      'AMAZON.YesIntent': function () {
          this.emit('PlayIntent');
      },
      
      'AMAZON.NoIntent': function () {
          this.response.speak('Okay, see you next time!');
          this.emit(':responseReady');
      },
      
      'AMAZON.PauseIntent': function () {

          var say = "If you pause, you'll lose your progress. Do you want to go to the next step?";

          // cross-session persistence is enabled
          if (persistenceEnabled){
            say = 'Okay, Saving your score.';
          }
          this.response.speak(say);
          this.emit(':responseReady');
      },
      
      'QuestionIntent': function () {
        this.attributes['answer'] = this.event.request.intent.slots.answer.value;
        var answer=this.attributes['answer'];
        
        i=randomSelect(6);
        
          
          
        if(answer === challenges.answers[q])
        {
          q++;
          
          l++;
          currentScore++;
          if(l==5)
          {
            level++;
            
            l=1;
            this.emit('PlayIntent');
          }
          
            say=data.congrats[i]+" You are right. Next Question. " + challenges.questions[q];
            display="\n Question: " + challenges.qdisplay[q];
            
          this.response.cardRenderer(this.t('TITLE'),"Your score is: " + currentScore + "\n"+ display );
        }
        else{
          var z=q;
          q++;
          say = 'I\'m Sorry. <amazon:effect name="whispered">Your answer is incorrect.</amazon:effect>. Correct answer is '+ challenges.answers[z] +". Next Question. " + challenges.questions[q];
          this.response.cardRenderer(('this.TITLE'), "You are wrong. \n Correct Answer is: " + challenges.answers[z]+".\n Next Question. " + challenges.questions[q]);
        }
        
        this.response.speak(say).listen("Please answer or ask to stop.");
        this.emit(':responseReady');
      },
      
      'AMAZON.HelpIntent': function () {
        say = "Welcome to Space g, this is a game skill designed to help you improve your space general knowledge with a fun story where you are pal an astronaut, and your mission is to save the world from destruction."+
        " During this mission you need to save the world you come across many problem, so answer the question asked and make a progress in this. This skill is best designed to help users to learn space facts.";
          if (!this.attributes['highScore']) {  // new session
          this.response.cardRenderer(this.t('TITLE'),say);
          this.response.speak(say + "Would you like to Start playing?").listen("Do you want to start a new game?");
          } else {
              highScore = this.attributes['highScore'];
              say += 'Your high score is ' + highScore + ' of the ' + this.t('TITLE') + ' game. ';
              var reprompt = 'Would you like to start a new game?';
              this.response.cardRenderer(this.t('TITLE'), "Highscore = " +highScore +"\n"+ say);
              this.response.speak(say + reprompt).listen(reprompt);
          }
          this.emit(':responseReady');
      },
      
      'AMAZON.StartOverIntent': function () {
          delete this.attributes['highScore'];
          delete this.attributes['level'];
          this.emit('LaunchRequest');
      },
      
      'AMAZON.CancelIntent': function () {
          this.response.speak(this.t('STOP'));
          this.emit(':responseReady');
      },
      
      'AMAZON.StopIntent': function () {
          this.emit('SessionEndedRequest');
      },
      
      'SessionEndedRequest': function () {
          highScore = incrementScore.call(this, currentScore);
          console.log('session ended!');
          this.response.speak('Your score is '+ currentScore + '. ' + '<say-as interpret-as="interjection">bye bye</say-as>');
          this.emit(':responseReady');
      }
  };

  //    END of Intent Handlers {} ========================================================================================
  // 3. Helper Function  =================================================================================================

  function incrementScore(currentScore){ 
      if(!this.attributes['highScore'])
      {
          this.attributes['highScore'] = currentScore;
      }
      else if(this.attributes['highScore'] < currentScore)
      {
        this.attributes['highScore'] = currentScore;
      }
      return this.attributes['highScore'];
  }
  
  function randomSelect(i){
    return (Math.floor(Math.random()*i));
  }