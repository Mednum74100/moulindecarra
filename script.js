/**
 * ==============================
 * ESCAPE GAME - LE MOULIN
 * Script JavaScript principal
 * ==============================
 */

// ====== VARIABLES GLOBALES ======
let solvedEnigmes = 0;
const totalEnigmes = 4;

// Configuration des solutions acceptées - CORRIGÉ
const solutions = {
  1: ["Jaune","jaune"],
  2: ["4", "quatre"],
  3: ["l", "L"],
  4: ["a", "A"]
};

// ====== FONCTIONS UTILITAIRES ======

/**
 * Affiche un message temporaire à l'utilisateur
 * @param {string} text - Le texte du message à afficher
 * @param {string} type - Le type de message ('success' ou 'error')
 */
function showMessage(text, type) {
  const container = document.getElementById('message-container');
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = text;
  container.appendChild(message);
  
  // Supprimer le message après 3 secondes
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 3000);
}

/**
 * Met à jour la barre de progression du jeu
 */
function updateProgress() {
  const progressText = document.getElementById('progress-text');
  const progressFill = document.getElementById('progress-fill');
  
  // Mettre à jour le texte et la largeur de la barre
  progressText.textContent = `${solvedEnigmes}/${totalEnigmes}`;
  progressFill.style.width = `${(solvedEnigmes / totalEnigmes) * 100}%`;
  
  // Vérifier si toutes les énigmes sont résolues
  if (solvedEnigmes === totalEnigmes) {
    setTimeout(() => {
      showFinalMessage();
    }, 1000);
  }
}

/**
 * Affiche le message final de félicitations
 */
function showFinalMessage() {
  const finalMessage = document.getElementById('final-message');
  finalMessage.style.display = 'block';
  
  // Scroll vers le message final
  finalMessage.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });
}

/**
 * Applique l'effet de secousse à un élément
 * @param {HTMLElement} element - L'élément à secouer
 */
function shakeElement(element) {
  element.style.animation = 'shake 0.5s ease-in-out';
  setTimeout(() => {
    element.style.animation = '';
  }, 500);
}

/**
 * Marque une énigme comme résolue
 * @param {number} num - Le numéro de l'énigme
 */
function markEnigmeAsSolved(num) {
  const enigmeDiv = document.getElementById(`enigme${num}`);
  const input = document.getElementById(`input${num}`);
  const button = enigmeDiv.querySelector('button');
  
  // Ajouter la classe CSS pour l'énigme résolue
  enigmeDiv.classList.add('completed');
  
  // Désactiver l'input et le bouton
  input.disabled = true;
  input.style.background = 'rgba(76, 175, 80, 0.3)';
  button.disabled = true;
  button.textContent = '✓ Résolu';
  
  // Afficher l'histoire correspondante
  const histoireDiv = document.getElementById(`histoire${num}`);
  histoireDiv.style.display = 'block';
  
  // Scroll vers l'histoire
  setTimeout(() => {
    histoireDiv.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }, 300);
}

// ====== FONCTION PRINCIPALE ======

/**
 * Vérifie la réponse d'une énigme
 * @param {number} num - Le numéro de l'énigme à vérifier
 */
function checkEnigme(num) {
  const input = document.getElementById(`input${num}`);
  const inputValue = input.value.trim();
  const enigmeDiv = document.getElementById(`enigme${num}`);
  
  // Vérifier si l'énigme est déjà résolue
  if (enigmeDiv.dataset.solved === 'true') {
    showMessage("Cette énigme est déjà résolue !", "error");
    return;
  }
  
  // Vérifier si une réponse a été saisie
  if (!inputValue) {
    showMessage("Veuillez entrer une réponse.", "error");
    shakeElement(input);
    return;
  }
  
  // Vérifier si la réponse est correcte
  const correctAnswers = solutions[num];
  const isCorrect = correctAnswers.some(answer => 
    inputValue.toLowerCase() === answer.toLowerCase()
  );
  
  if (isCorrect) {
    // Marquer l'énigme comme résolue
    markEnigmeAsSolved(num);
    
    // Incrémenter le compteur si pas encore résolu
    if (!enigmeDiv.dataset.solved) {
      solvedEnigmes++;
      enigmeDiv.dataset.solved = 'true';
      updateProgress();
    }
    
    showMessage("Bonne réponse ! L'histoire se dévoile...", "success");
    
  } else {
    // Réponse incorrecte
    showMessage("Ce n'est pas la bonne réponse. Regarde bien !", "error");
    shakeElement(input);
    
    // Vider le champ de saisie
    input.value = '';
    input.focus();
  }
}

// ====== GESTION DES ÉVÉNEMENTS ======

/**
 * Gère l'appui sur la touche Entrée
 * @param {KeyboardEvent} event - L'événement clavier
 */
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    const activeInput = document.activeElement;
    if (activeInput && activeInput.tagName === 'INPUT') {
      const enigmeNumber = activeInput.id.replace('input', '');
      if (enigmeNumber && !isNaN(enigmeNumber)) {
        checkEnigme(parseInt(enigmeNumber));
      }
    }
  }
}

/**
 * Gère la soumission des formulaires (empêche le rechargement)
 * @param {Event} event - L'événement de soumission
 */
function handleFormSubmit(event) {
  event.preventDefault();
}

/**
 * Initialise le jeu et tous ses événements
 */
function initializeGame() {
  console.log('🎮 Initialisation de l\'Escape Game - Le Moulin');
  
  // Événement pour la touche Entrée
  document.addEventListener('keypress', handleKeyPress);
  
  // Empêcher la soumission des formulaires
  document.addEventListener('submit', handleFormSubmit);
  
  // Initialiser la barre de progression
  updateProgress();
  
  // Focus sur le premier input
  const firstInput = document.getElementById('input1');
  if (firstInput) {
    firstInput.focus();
  }
  
  console.log('✅ Jeu initialisé avec succès !');
}

// ====== DÉMARRAGE DU JEU ======

// Démarrer le jeu quand le DOM est entièrement chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGame);
} else {
  // Le DOM est déjà chargé
  initializeGame();
}

// ====== FONCTIONS UTILITAIRES SUPPLÉMENTAIRES ======

/**
 * Remet à zéro le jeu (fonction utile pour le développement)
 */
function resetGame() {
  solvedEnigmes = 0;
  
  // Réinitialiser toutes les énigmes
  for (let i = 1; i <= totalEnigmes; i++) {
    const enigmeDiv = document.getElementById(`enigme${i}`);
    const input = document.getElementById(`input${i}`);
    const button = enigmeDiv.querySelector('button');
    const histoire = document.getElementById(`histoire${i}`);
    
    // Réinitialiser l'apparence
    enigmeDiv.classList.remove('completed');
    enigmeDiv.dataset.solved = 'false';
    
    // Réactiver les contrôles
    input.disabled = false;
    input.value = '';
    input.style.background = '';
    button.disabled = false;
    button.textContent = 'Valider';
    
    // Masquer l'histoire
    histoire.style.display = 'none';
  }
  
  // Masquer le message final
  document.getElementById('final-message').style.display = 'none';
  
  // Réinitialiser la progression
  updateProgress();
  
  // Vider les messages
  document.getElementById('message-container').innerHTML = '';
  
  console.log('🔄 Jeu remis à zéro');
}

// Exposer la fonction reset pour le développement
window.resetGame = resetGame;
