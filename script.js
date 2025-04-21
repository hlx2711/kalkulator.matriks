function generateMatrix(id, rows, cols) {
    const container = document.getElementById(id);
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  
    for (let i = 0; i < rows * cols; i++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.placeholder = '';
      container.appendChild(input);
    }
  }
  
  function getMatrixValues(id, rows, cols) {
    const inputs = document.getElementById(id).querySelectorAll('input');
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const val = parseFloat(inputs[i * cols + j].value) || 0;
        row.push(val);
      }
      matrix.push(row);
    }
    return matrix;
  }
  
  function displayResult(matrix) {
    const result = document.getElementById('result');
    result.innerHTML = matrix.map(row => row.join('  ')).join('\\n');
  }
  
  function generateMatrices() {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);
    generateMatrix('matrixA', rowsA, colsA);
    generateMatrix('matrixB', rowsB, colsB);
  }
  
  function resetAll() {
    document.getElementById('rowsA').value = '';
    document.getElementById('colsA').value = '';
    document.getElementById('rowsB').value = '';
    document.getElementById('colsB').value = '';
    document.getElementById('matrixA').innerHTML = '';
    document.getElementById('matrixB').innerHTML = '';
    document.getElementById('result').innerHTML = '';
  }
  
  function calculate() {
    const operation = document.getElementById('operation').value;
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);
  
    const A = getMatrixValues('matrixA', rowsA, colsA);
    const B = getMatrixValues('matrixB', rowsB, colsB);
  
    let result = [];
  
    if (operation === 'add' || operation === 'subtract') {
      if (rowsA !== rowsB || colsA !== colsB) {
        alert('Ukuran matriks harus sama untuk operasi ini.');
        return;
      }
      for (let i = 0; i < rowsA; i++) {
        const row = [];
        for (let j = 0; j < colsA; j++) {
          row.push(operation === 'add' ? A[i][j] + B[i][j] : A[i][j] - B[i][j]);
        }
        result.push(row);
      }
    } else if (operation === 'multiply') {
      if (colsA !== rowsB) {
        alert('Kolom A harus sama dengan baris B untuk perkalian.');
        return;
      }
      for (let i = 0; i < rowsA; i++) {
        const row = [];
        for (let j = 0; j < colsB; j++) {
          let sum = 0;
          for (let k = 0; k < colsA; k++) {
            sum += A[i][k] * B[k][j];
          }
          row.push(sum);
        }
        result.push(row);
      }
    } else if (operation === 'determinant') {
      if (rowsA !== colsA) {
        alert('Determinan hanya untuk matriks persegi.');
        return;
      }
      const det = determinant(A);
      result = [[det]];
    } else if (operation === 'inverse') {
      if (rowsA !== colsA) {
        alert('Invers hanya untuk matriks persegi.');
        return;
      }
      const inv = inverseMatrix(A);
      if (!inv) {
        alert('Matriks tidak memiliki invers.');
        return;
      }
      result = inv;
    }
  
    displayResult(result);
  }
  
  function selectOperation(op) {
    document.getElementById('operation').value = op;
  
    const buttons = document.querySelectorAll('.operation-buttons button');
    buttons.forEach(btn => btn.classList.remove('active'));
  
    const activeBtn = Array.from(buttons).find(btn => 
      btn.textContent.includes(op.charAt(0).toUpperCase()) || 
      btn.textContent.toLowerCase().includes(op)
    );
    if (activeBtn) activeBtn.classList.add('active');
  }
  
  // Fungsi Determinan rekursif
  function determinant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
    let det = 0;
    for (let i = 0; i < n; i++) {
      const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
      det += matrix[0][i] * determinant(minor) * (i % 2 === 0 ? 1 : -1);
    }
    return det;
  }
  
  // Fungsi invers (Gauss-Jordan sederhana)
  function inverseMatrix(A) {
    const n = A.length;
    const I = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
  
    for (let i = 0; i < n; i++) {
      let factor = A[i][i];
      if (factor === 0) return null;
  
      for (let j = 0; j < n; j++) {
        A[i][j] /= factor;
        I[i][j] /= factor;
      }
  
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          let factor2 = A[k][i];
          for (let j = 0; j < n; j++) {
            A[k][j] -= factor2 * A[i][j];
            I[k][j] -= factor2 * I[i][j];
          }
        }
      }
    }
  
    return I;
  }
  