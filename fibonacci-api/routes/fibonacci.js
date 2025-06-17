const express = require('express');
const router = express.Router();

// Tính Fibonacci với giới hạn thời gian
function* fibonacciGenerator(n) {
  let a = 0n, b = 1n;
  for (let i = 0; i < n; i++) {
    yield a;
    [a, b] = [b, a + b];
  }
}

router.get('/fibonacci', async (req, res) => {
  const n = parseInt(req.query.n);
  const TIME_LIMIT = 1000; // tối đa 1000ms

  if (isNaN(n) || n <= 0) {
    return res.status(400).json({ error: 'Vui lòng nhập số nguyên dương' });
  }

  const result = [];
  const gen = fibonacciGenerator(n);
  const startTime = Date.now();
  let timeout = false;

  for (let val of gen) {
    if (Date.now() - startTime > TIME_LIMIT) {
      timeout = true;
      break;
    }
    result.push(val.toString()); // BigInt to string
  }

  res.json({
    sequence: result,
    max_requested: n,
    returned: result.length,
    timed_out: timeout,
    note: timeout
      ? `Chỉ trả về ${result.length} phần tử do giới hạn thời gian ${TIME_LIMIT}ms.`
      : 'Trả về đầy đủ.',
  });
});

module.exports = router;



// 1. Cách triển khai trong fibonaccifibonacci
// 1.1. Cấu trúc API
// - Phương thức: GET
// - Đường dẫn: /api/fibonacci
// - Tham số: `n` - số phần tử Fibonacci cần trả về.

// 1.2. Kỹ thuật cốt lõi:
// - Sử dụng hàm generator để tính Fibonacci theo từng bước.
// - Duyệt từng phần tử trong vòng lặp, kiểm tra thời gian chạy.
// - Nếu vượt quá TIME_LIMIT (ví dụ: 1000ms), ngắt và trả lại dãy hiện có.


// 2. Kết luậnluận

// Việc áp dụng chiến lược "Bound Execution Time" giúp hệ thống:
// - Hạn chế quá tải tài nguyên khi xử lý số lượng lớn.
// - Tránh các request treo dài gây nghẽn server.
// - Duy trì hiệu suất và khả năng phản hồi tốt cho toàn hệ thống.

// Chiến lược này đặc biệt phù hợp cho các API tính toán tuyến tính, có thể dừng giữa chừng,
// như tính Fibonacci, xử lý thống kê, hoặc xử lý chuỗi dài theo từng bước.