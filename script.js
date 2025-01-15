
        let currentQuestionIndex = 0;
        let totalTimeRemaining = 3600; // 1 hour in seconds
        let questionTimer, totalTimer;
        const totalQuestions = 40;
        const answers = Array(totalQuestions).fill(null);
        const markedQuestions = new Set();
        let startTimestamp = null; // Lưu mốc thời gian khi bắt đầu câu hiện tại
        const timePerQuestion = Array(totalQuestions).fill(0); // Lưu thời gian của mỗi câu

        function getCurrentTimestamp() {
            return Date.now();
        }

        function showAnswerSection() {
            document.getElementById('answer-container').style.display = 'block';
        
            const checkboxesContainer = document.getElementById('checkboxes-container');
            checkboxesContainer.innerHTML = ''; // Reset container
        
            for (let i = 0; i < totalQuestions; i++) {
                const label = document.createElement('label');
                label.style.display = 'flex';
                label.style.alignItems = 'center';
        
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.addEventListener('change', updateScore);
        
                const span = document.createElement('span');
                span.textContent = `Câu ${i + 1}`;
        
                label.appendChild(checkbox);
                label.appendChild(span);
                checkboxesContainer.appendChild(label);
            }
        }
        
        function updateScore() {
            const checkboxes = document.querySelectorAll('#checkboxes-container input[type="checkbox"]');
            const score = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
            document.getElementById('total-score').textContent = score;
        }
        
        function endExam() {
    if (startTimestamp !== null && currentQuestionIndex >= 0 && currentQuestionIndex < totalQuestions) {
        const endTimestamp = getCurrentTimestamp();
        const timeSpent = Math.floor((endTimestamp - startTimestamp) / 1000); // Chuyển đổi ms sang giây
        // Chỉ ghi thời gian làm bài thực tế, không cộng thêm thời gian dư
        if (totalTimeRemaining > 0) {
            timePerQuestion[currentQuestionIndex] += Math.min(timeSpent, totalTimeRemaining);
        }
    }
    clearInterval(totalTimer);
    clearInterval(questionTimer);
    playAlarm();
    alert("Hết giờ hoặc bài đã nộp!");
    document.getElementById('chart-container').style.display = 'block';
    document.getElementById('answer-container').style.display = 'block';
    showChart();
    showAnswerSection();
}


        function recordTimeForQuestion() {
            if (startTimestamp !== null && currentQuestionIndex >= 0 && currentQuestionIndex < totalQuestions && totalTimeRemaining > 0) {
                const endTimestamp = getCurrentTimestamp();
                const timeSpent = Math.floor((endTimestamp - startTimestamp) / 1000); // Chuyển đổi ms sang giây
                timePerQuestion[currentQuestionIndex] += timeSpent;
            }
            startTimestamp = getCurrentTimestamp(); // Khởi động lại cho câu tiếp theo
        }

function showChart() {
    const ctx = document.getElementById('timeChart').getContext('2d');
    if (window.timeChartInstance) {
        window.timeChartInstance.destroy(); // Hủy biểu đồ cũ nếu có
    }
    window.timeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: totalQuestions }, (_, i) => `Câu ${i + 1}`),
            datasets: [{
                label: 'Thời gian sử dụng (phút:giây)',
                data: timePerQuestion.map(val => val || 0), // Đảm bảo không có giá trị undefined
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Thời gian (phút:giây)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatTimeForChart(value); // Chuyển giây sang phút:giây trên trục Y
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Câu hỏi'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const rawValue = context.raw || 0; // Giá trị thời gian thực (giây)
                            return `${context.dataset.label}: ${formatTimeForChart(rawValue)}`;
                        }
                    }
                }
            }
        }
    });
}


function formatTimeForChart(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}




        function startTimers() {
            clearInterval(questionTimer); // Đảm bảo bộ đếm cũ được xóa
            questionTimer = setInterval(() => {
                if (currentQuestionIndex >= 0 && currentQuestionIndex < totalQuestions) {
                    const elapsedTime = Math.floor((getCurrentTimestamp() - startTimestamp) / 1000);
                    document.querySelector('.time-used').innerText = formatTime(elapsedTime);
                }
            }, 1000);
        
            if (!totalTimer) {
                totalTimer = setInterval(() => {
                    totalTimeRemaining--;
                    document.querySelector('.time-remaining').innerText = formatTime(totalTimeRemaining);
                    if (totalTimeRemaining <= 0) {
                        clearInterval(questionTimer); // Dừng đếm thời gian câu hỏi
                        endExam();
                    }
                }, 1000);
            }
        }

        // Assuming answers and examChoice are already stored in localStorage
function loadQuestion(index) {
    const examChoice = localStorage.getItem('examChoice'); // Get the exam choice from localStorage
    if (!examChoice) {
        alert("Không có thông tin đề thi. Vui lòng chọn đề thi.");
        return;
    }

    // Adjust question source based on the chosen exam
    const questionElement = document.querySelector('.question img');
    questionElement.src = `TSA_De_${examChoice}/c${index + 1}.png`; // Dynamically set question image based on exam choice

    const answerInput = document.querySelector('.answer-input');
    answerInput.value = answers[index] || '';

    updateProgressBar();
    recordTimeForQuestion(); // Reset the timer when loading a new question
}


        function navigateQuestion(direction) {
            recordTimeForQuestion(); // Ghi lại thời gian câu hiện tại trước khi chuyển
            if (direction === 'next' && currentQuestionIndex < totalQuestions - 1) {
                currentQuestionIndex++;
            } else if (direction === 'prev' && currentQuestionIndex > 0) {
                currentQuestionIndex--;
            }
            loadQuestion(currentQuestionIndex);
            updateActiveButton();
        }

        function updateActiveButton() {
            document.querySelectorAll('.number-buttons button').forEach((btn, index) => {
                btn.classList.remove('active');
                if (index === currentQuestionIndex) {
                    btn.classList.add('active');
                }
                if (answers[index]) {
                    btn.classList.add('answered');
                    if (markedQuestions.has(index)) {
                        btn.classList.remove('answered');
                        btn.classList.add('marked');
                    }
                } else {
                    btn.classList.remove('answered', 'marked');
                }
            });
        }

        function updateProgressBar() {
            const answeredCount = answers.filter(answer => answer !== null && answer.trim() !== '').length;
            const progressBar = document.querySelector('.progress-bar-inner');
            const progress = (answeredCount / totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${answeredCount}/${totalQuestions}`;
        }

        function playAlarm() {
            const alarm = new Audio('alarm.mp3');
            alarm.currentTime = 0; // Đặt thời gian bắt đầu từ 1 phút 3 giây (63 giây)
            alarm.play().catch(error => {
                console.error("Không thể phát âm thanh:", error);
                alert("Hết giờ! Âm thanh không thể phát.");
            });
        }

        document.addEventListener("DOMContentLoaded", function() {
            loadQuestion(currentQuestionIndex);
            startTimestamp = getCurrentTimestamp(); // Lưu mốc thời gian bắt đầu
            startTimers();

            const answerInput = document.querySelector('.answer-input');
            answerInput.addEventListener('input', () => {
                answers[currentQuestionIndex] = answerInput.value; // Lưu đáp án
                updateActiveButton(); // Cập nhật nút trạng thái
                updateProgressBar(); // Cập nhật thanh tiến trình
            });

            const numberButtonsContainer = document.querySelector('.number-buttons');
            for (let i = 0; i < totalQuestions; i++) {
                const button = document.createElement('button');
                button.textContent = i + 1;
                button.addEventListener('click', () => {
                    currentQuestionIndex = i;
                    updateActiveButton();
                    loadQuestion(i);
                });
                numberButtonsContainer.appendChild(button);
            }

            document.querySelector('.mark-button').addEventListener('click', () => {
                if (markedQuestions.has(currentQuestionIndex)) {
                    markedQuestions.delete(currentQuestionIndex);
                } else {
                    markedQuestions.add(currentQuestionIndex);
                }
                updateActiveButton();
            });

            updateActiveButton();
        });

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        function submitAnswers() {
            const answeredCount = answers.filter(answer => answer !== null && answer.trim() !== '').length;
            if (answeredCount < totalQuestions) {
                if (!confirm(`Bạn mới trả lời ${answeredCount}/${totalQuestions} câu hỏi. Bạn có chắc chắn muốn nộp bài?`)) {
                    return;
                }
            }
            alert("Bài làm đã được nộp thành công!");
	    endExam(); 
            // Logic xử lý nộp bài có thể được thêm tại đây (ví dụ: gửi dữ liệu qua API)
        }

function checkPassword() {
    const password = prompt("Enter the password:");
    if (password === "thu_khoa_det_may") {
	document.getElementById("content").style.display = "block";
    } else {
	alert("Incorrect password!");
	checkPassword();
    }
}


function showTab(tabId) {
    // Ẩn tất cả nội dung tab
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });

    // Bỏ trạng thái active của tất cả các nút
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Hiển thị tab được chọn và đánh dấu nút tương ứng
    document.getElementById(tabId).style.display = 'block';
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

// Hiển thị tab mặc định khi tải
document.addEventListener("DOMContentLoaded", () => {
    showTab('answer-file'); // Tab mặc định là File đáp án
});


const videos = {
    "1": [
        { id: "CcOoGQpSFRI", title: "Chữa đề phần 1"}
    ],
    "2": [
        { id: "WyTi0-7pjqE", title: "Chữa đề phần 1" },
	{ id: "bPBcdc_3zAk", title: "Chữa đề phần 2" }
    ],
    "3": [
        { id: "2Vv-BfVoq4g", title: "Chữa đề phần 3" }
    ]
};

// Tạo danh sách video tương ứng với đề thi đã chọn
function populateVideoList() {
    const videoList = document.getElementById("video-list");
    videoList.innerHTML = ""; // Xóa nội dung cũ nếu có

    const selectedExam = localStorage.getItem('examChoice');
    
    if (selectedExam && videos[selectedExam]) {
        videos[selectedExam].forEach(video => {
            const li = document.createElement("li");
            li.textContent = video.title;
            li.onclick = () => playVideo(video.id);
            videoList.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "Không có video cho đề thi này";
        videoList.appendChild(li);
    }
}

// Phát video được chọn
function playVideo(videoId) {
    const player = document.getElementById("youtube-player");
    player.src = `https://www.youtube.com/embed/${videoId}`;
}

// Khởi tạo danh sách video khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    populateVideoList();
});
