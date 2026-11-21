// Pięć błędów naprawionych w ćwiczeniu z debugowania.
const zadania = [
  { tytul: 'Struktura repozytorium', status: 'done' },
  { tytul: 'Skrypt bazy danych', status: 'done' },
  { tytul: 'API tablic', status: 'in_progress' },
  { tytul: 'Widok tablicy', status: 'todo' },
  { tytul: 'Raport testów', status: 'todo' }
];

function policzWykonane(lista) {
  let licznik = 0;
  // 1. Zamiast <= musi być <, żeby nie wyjść poza tablicę.
  for (let i = 0; i < lista.length; i++) {
    // 2. Porównujemy ===, a nie przypisujemy = (to zmieniało status).
    if (lista[i].status === 'done') licznik++;
  }
  // 3. Funkcja musi zwrócić policzoną liczbę.
  return licznik;
}

function pokazPodsumowanie() {
  // 4. Używamy istniejącej tablicy zadania, nie nieistniejącego zadanie.
  const wykonane = policzWykonane(zadania);
  const procent = Math.round((wykonane / zadania.length) * 100);
  document.getElementById('wynik').textContent =
    `Wykonane: ${wykonane} z ${zadania.length} (${procent}%)`;
}

// 5. Prawidłowa nazwa zdarzenia to click, nie clik.
document.getElementById('policz').addEventListener('click', pokazPodsumowanie);
