const questionFolders = [
    { numQuestions: 40, folderName: 'TSA_De_1' },
    { numQuestions: 40, folderName: 'TSA_De_2' },
    { numQuestions: 40, folderName: 'TSA_De_3' },
    { numQuestions: 40, folderName: 'TSA_De_4' },
    { numQuestions: 40, folderName: 'TSA_De_5' },
    { numQuestions: 40, folderName: 'TSA_De_6' },
    { numQuestions: 40, folderName: 'TSA_De_7' },
    { numQuestions: 25, folderName: 'TSA_De_10' }, 
    { numQuestions: 25, folderName: 'TSA_De_11' },

    { numQuestions: 50, folderName: 'HSA_De_1' },
    { numQuestions: 50, folderName: 'HSA_De_2' },

    { numQuestions: 40, folderName: 'De_Rand_1' },
    { numQuestions: 27, folderName: 'De_Rand_2' }




    


];  // Cập nhật thư mục khi có thêm

let currentQuestion = 1;
let totalQuestions = 0;
let timePerQuestion = 30;
let timerInterval;
let results = [];
let selectedImages = [];

function startQuiz() {
    totalQuestions = parseInt(document.getElementById('total-questions').value);
    timePerQuestion = parseInt(document.getElementById('time-per-question').value);

    if (totalQuestions > 0 && timePerQuestion > 0) {
        // Chọn các hình ảnh ngẫu nhiên từ tất cả các thư mục
        selectedImages = getRandomImagesFromAllFolders(questionFolders, totalQuestions);
        document.querySelector('.setup-container').style.display = 'none';
        document.querySelector('.quiz-container').style.display = 'block';
        document.getElementById('total-question-count').textContent = totalQuestions;
        document.getElementById('current-question').textContent = currentQuestion;
        document.querySelector('.question-image').src = selectedImages[currentQuestion - 1];
        startTimer();
    } else {
        alert('Vui lòng nhập số lượng câu hỏi và thời gian hợp lệ!');
    }
}

// Hàm lấy danh sách tất cả các hình ảnh từ các thư mục
function getRandomImagesFromAllFolders(folders, totalQuestions) {
    let allImages = [];

    // Lặp qua các thư mục để lấy tất cả các ảnh theo số lượng của từng thư mục
    folders.forEach(folder => {
        const folderImages = Array.from({ length: folder.numQuestions }, (_, index) => {
            return `${folder.folderName}/c${index + 1}.png`;
        });
        allImages.push(...folderImages);
    });

    // Xáo trộn danh sách hình ảnh và lấy ra số lượng ảnh ngẫu nhiên tương ứng với số câu hỏi
    const shuffledImages = allImages.sort(() => Math.random() - 0.5);
    return shuffledImages.slice(0, totalQuestions);
}

function startTimer() {
    let timeLeft = timePerQuestion;
    document.getElementById('time-left').textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            saveAnswerAndNext(timePerQuestion);
        }
    }, 1000);
}

function nextQuestion() {
    clearInterval(timerInterval);
    // Tính thời gian đã dùng dựa vào thời gian còn lại hiện tại
    const elapsedTime = timePerQuestion - parseInt(document.getElementById('time-left').textContent);
    saveAnswerAndNext(elapsedTime);
}

function saveAnswerAndNext(elapsedTime) {
    const answer = document.getElementById('answer-input').value;
    results.push({
        question: currentQuestion,
        answer: answer,
        timeTaken: elapsedTime,
        imageSrc: selectedImages[currentQuestion - 1]
    });

    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        document.getElementById('current-question').textContent = currentQuestion;
        document.querySelector('.question-image').src = selectedImages[currentQuestion - 1];
        document.getElementById('answer-input').value = '';
        startTimer();
    } else {
        showResults();
    }
}

function showResults() {
    document.querySelector('.quiz-container').style.display = 'none';
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.style.display = 'block';
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    results.forEach(result => {
        const imageSrc = result.imageSrc;
        resultsDiv.innerHTML += `
            <div class="result-item">
                <img src="${imageSrc}" alt="Câu hỏi ${result.question}" class="question-image">
                <div>Câu ${result.question}: trả lời { ${result.answer || 'Không trả lời'} } | Thời gian: ${result.timeTaken} giây</div>
            </div>
        `;
    });
}

function restartQuiz() {
    currentQuestion = 1;
    results = [];
    document.getElementById('answer-input').value = '';
    document.getElementById('total-questions').value = 5;
    document.getElementById('time-per-question').value = 30;
    document.querySelector('.setup-container').style.display = 'block';
    document.getElementById('results-container').style.display = 'none';
}
