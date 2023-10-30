/**
 * The Main Application
 * i vervangen door 0 en de i ++ waarde meegeven
 */

import { readFromStorage, writeToStorage } from "./storage.js";

import {
  APP_TITLE,
  API_TOKEN,
  API_URL,
  API_DIFFICULTIES,
  API_CATEGORIES,
  API_LIMIT
} from './constants.js';

const KEY_QUESTIONS = 'KEY_QUESTIONS';
const KEY_ANSWERS = 'KEY_ANSWERS';

(() => {
  let i = 0;
  const app = {
    initialize() {
      this.cacheElements();
      this.hideElement(this.$results);
      this.createdFilters();
      this.userAnswersList = [];
      this.registerListeners();
    },
    cacheElements() {
      this.$index = document.querySelector('.index')
      this.$results = document.getElementById('results');
      this.$answers = document.getElementById('answers');
      this.$quiz = document.getElementById('body-quiz');
      this.$headerQuiz = document.getElementById('header-quiz')
      this.$startQuizButton = document.querySelector('.start-quiz');
      this.$category = document.getElementById('category');
      this.$difficulty = document.getElementById('difficulty');
      this.$limit = document.querySelector('.limit input');
      this.$amOfQuest = document.getElementById('questions-amount-title');
      this.$questions = document.getElementById('question-each');
      this.$question = document.getElementById('question');
      this.$allQuests = document.getElementById('all-quests');
      this.$nextBtn = document.getElementById('next-btn')
      this.$resetQuiz = document.getElementById('restart');
      this.$resetQuizBtn = document.getElementById('back-btn');
      this.$stopBtnQuiz = document.getElementById('stop-btn');
      this.$answerlist = document.querySelector('.answers-list');
    },

    createdFilters() {
      API_CATEGORIES.map(cate => {
        this.$category.innerHTML += `<option value="${cate}">${cate}</option>`
      });
      API_DIFFICULTIES.map(diff => {
        this.$difficulty.innerHTML += `<option value="${diff}">${diff}</option>`
      });
    },

    registerListeners() {
      this.$startQuizButton.addEventListener('click', (ev) => {
        this.fetchQuestions();
        this.startQuiz();
        this.hideElement(this.$headerQuiz);
        this.showElement(this.$nextBtn);
        
      })
      this.$nextBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        this.checkAnswer();
        this.currentQuestion++;
        clearInterval(this.time);
        this.showQuestion(this.questions);
        i++;
        this.$index.innerHTML = i;
      })
      this.$resetQuiz.addEventListener('click', (ev) => {
        location.reload();
        clearInterval(this.time);
        ev.preventDefault();
        this.createNewQuiz();
        localStorage.clear();
      })
      this.$resetQuizBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        this.startQuiz();
        this.showElement(this.$headerQuiz);
        this.hideElement(this.$nextBtn);
        this.hideElement(this.$quiz);
        clearInterval(this.time);
      })
    },

    async fetchQuestions() {
      const url = `${API_URL}?apiKey=${API_TOKEN}&category=${this.$category.value}&difficulty=${this.$difficulty.value}&limit=${this.$limit.value}`;
      // let cache = readFromStorage(KEY_QUESTIONS);
      // if(!cache) {
        this.currentQuestion = 0;
        this.correctAnswer = 0;
        this.wrongAnswer = 0;
        const response = await fetch(url);
        const questions = await response.json();
        writeToStorage(KEY_QUESTIONS, questions);
        this.questions = questions;
        console.log(questions[i].question);
      // } 
      // else {
      //   this.questions = cache;
      // }
      this.fetchUserAnswers();
      this.showQuestion();
      
    },

    fetchUserAnswers() {
      let cache = readFromStorage(KEY_ANSWERS);
      if(!cache) {
        this.userAnswers = null;
      } else {
        this.userAnswers = cache;
        if (this.userAnswers.length < this.questions.length) {
          this.currentQuestion = this.userAnswers.length;
        } else {
          this.currentQuestion = this.questions.length - 1;
        }
      }
      
    },

    startQuiz() {
      this.userAnswers = [];
      writeToStorage(KEY_ANSWERS, this.userAnswers);
    },

    addUserAnswer(answer) {        
      this.userAnswers[this.currentQuestion] = answer;
      writeToStorage(KEY_ANSWERS, this.userAnswers);
    },

    showQuiz() {
      this.showElement(this.$quiz);
      console.log(this.$quiz);
    },

    showQuestion() {
      if (this.currentQuestion !== this.questions.length) {
        this.$questions.innerHTML = `<p>${this.questions[this.currentQuestion].question}</p>`
        this.createAnswers(this.questions, this.currentQuestion);
        this.hideQuizHeading();
        this.showQuiz();
        this.setTimerForQuiz();
      } else {
        this.endQuiz(this.question);
      }
    },

    setTimerForQuiz() {
      this.timerleft = 15;
      this.time = setInterval(() => {
        document.getElementById('timer').innerHTML = this.timerleft;
        if(this.timerleft > 0) {
          console.log(this.timerleft)
          this.timerleft--;
        } else {
          console.log('stop')
          this.currentQuestion++;
          clearInterval(this.time);
          this.showQuestion();
        } 
      }, 1000)
  },

    hideQuizHeading() {
      this.hideElement(this.$headerQuiz);
    },

    showElement(el) {
      el.classList.remove('hide');
      el.classList.add('show');
    },

    hideElement(el) {
      el.classList.remove('show');
      el.classList.add('hide');
    },

    createAnswers(data, currentQuestion) {
      this.$allQuests.innerHTML = '';
      console.log(this.$allQuests)
      for (const key in data[this.currentQuestion].answers) {
        if (data[this.currentQuestion].answers.hasOwnProperty(key) && data[this.currentQuestion].answers[key] !== null) {
          this.$allQuests.innerHTML += `<li class="answer_button" data-key='${key}'>${data[this.currentQuestion].answers[key]}</li>`
        }
      }
      this.$answer_buttons = document.querySelectorAll('.answer_button');
      this.$answer_buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.selectAnswer = {
            key:e.target.dataset.key,
            answer: e.target.innerHTML
          };
          e.target.classList.toggle('active');
          this.addUserAnswer(this.selectAnswer);
          console.log(this.selectAnswer)
          console.log(this.userAnswers);
        })
      });

      if (currentQuestion !== data.length) {
        this.correct_answer = data[this.currentQuestion].correct_answer;
        console.log(data[this.currentQuestion].correct_answer)
      
      }
    },

    checkAnswer() {
      if (this.selectAnswer !== undefined) {
        this.userAnswersList.push(this.selectAnswer);
      } else {
        console.log('wrong');
      }
      if(this.selectAnswer === this.questions[this.currentQuestion].correct_answer) {
        this.correctAnswer++;
      } else {
        this.wrongAnswer++;
      } 
    },
    
    createNewQuiz() {
      this.$allQuests.innerHTML = '';
      this.$questions.innerHTML = '';

      this.showElement(this.$headerQuiz);
      this.hideElement(this.$results);
      this.hideElement(this.$quiz);
    },
    
    endQuiz() {
      console.log(this.userAnswersList)
      this.userAnswersList.map((key, i) => {
        for(const key in this.questions[i].answers) {
          if(key === this.questions[i].correct_answer) {
            this.correctQuestionAnswer = (this.questions[i].answers[key]);
          }
        }
        this.$answerlist.innerHTML +=`
        <li>
        <p>${this.correctAnswer}/${this.questions.length}</p>
        <h2>correct antwoord: ${this.correctQuestionAnswer}</h2>
        <p>uw antwoord is:<br> ${key.answer} </br></p>
        </li>
        `
      })
      this.hideElement(this.$nextBtn);
      this.hideElement(this.$quiz);
      this.showElement(this.$results);
    }
  }
  app.initialize();

})();
