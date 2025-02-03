// Hàm cập nhật trạng thái sidebar dựa trên input của người dùng
    function updateSidebar() {
      const inputs = document.querySelectorAll('.answer input');
      const questions = document.querySelectorAll('.question-list li');

      inputs.forEach((input, index) => {
        if (input.value.trim() !== "") {
          questions[index].classList.add('answered');
        } else {
          questions[index].classList.remove('answered');
        }
      });
    }

    // Hàm cuộn trang đến câu hỏi tương ứng
    function scrollToQuestion(index) {
      const questions = document.querySelectorAll('.question');
      if (questions[index]) {
        questions[index].scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Hàm chạy đồng hồ đếm ngược
    function startTimer(duration, display) {
      let timer = duration, minutes, seconds;
      const interval = setInterval(() => {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = `${minutes}:${seconds}`;

        if (--timer < 0) {
          clearInterval(interval);
          alert("Hết thời gian làm bài!");
        }
      }, 1000);
    }

    document.addEventListener('DOMContentLoaded', () => {
      const timerDisplay = document.querySelector('.timer');
      const container = document.querySelector('.container');
      const sidebar = document.querySelector('.question-list');
      const duration = 75 * 60; // 75 phút tính theo giây

      // Lấy thông tin examChoice từ localStorage
      let examChoice = localStorage.getItem('examChoice');
      if (!examChoice) {
        alert("Không tìm thấy thông tin đề thi. Quay lại trang chọn đề.");
        window.location.href = "index.html";
        return;
      }
      examChoice = Number(examChoice);

      // Với examChoice âm, giá trị tuyệt đối của nó quyết định tên thư mục đề
      const folderNumber = Math.abs(examChoice);
      const folderName = `HSA_De_${folderNumber}`;

      startTimer(duration, timerDisplay);

      // Tạo 50 câu hỏi với ảnh lấy từ thư mục tương ứng
      for (let i = 1; i <= 50; i++) {
        // Thêm sidebar item
        const li = document.createElement('li');
        li.textContent = `Câu ${i}`;
        li.onclick = () => scrollToQuestion(i - 1);
        sidebar.appendChild(li);

        // Tạo nội dung câu hỏi
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
          <p><b>Câu ${i}:</b></p>
          <img src="${folderName}/c${i}.png" alt="Câu hỏi ${i}" onerror="this.style.display='none'">
          <div class="answer">
            <label for="answer${i}">Nhập câu trả lời:</label>
            <input type="text" id="answer${i}" name="answer${i}" oninput="updateSidebar()">
          </div>
        `;
        container.appendChild(questionDiv);
      }
    });