# Backend

Backend to część aplikacji, która będzie działać po stronie serwera. Będzie odbierać dane ze strony, sprawdzać je i wykonywać odpowiednie działania.

## Do czego będzie potrzebny?

Backend będzie odpowiadać między innymi za:

- rejestrację i logowanie użytkowników;
- sprawdzanie, czy użytkownik ma dostęp do danej tablicy;
- dodawanie, edytowanie i usuwanie tablic;
- dodawanie i edytowanie zadań;
- zmianę statusu i priorytetu zadań;
- przypisywanie zadań do użytkowników;
- pobieranie i zapisywanie danych w bazie;
- wysyłanie odpowiedzi do frontendu.

## Przykład działania

Jeśli użytkownik będzie chciał dodać zadanie, frontend wyśle jego dane do backendu. Backend sprawdzi, czy dane są poprawne i czy użytkownik ma dostęp do wybranej tablicy. Jeśli wszystko będzie w porządku, zapisze zadanie w bazie danych i odeśle informację do strony.

## Jakie pliki będą tutaj potrzebne?

W tym folderze mogą znaleźć się pliki do obsługi użytkowników, tablic, zadań, połączenia z bazą danych i ustawień serwera. Dokładny podział plików będzie zależał od tego, jak zostanie zrobiony backend.

## Bezpieczeństwo

Backend będzie musiał sprawdzać dane również po stronie serwera. Nie wystarczy sprawdzenie formularza w przeglądarce. Ważne będzie też sprawdzanie uprawnień użytkownika.

Hasła nie powinny być zapisywane zwykłym tekstem. W diagramie bazy danych przewidziano pole `passwordHash`, w którym będzie przechowywany skrót hasła.

## Powiązane części projektu

- [Frontend](../frontend/README.md) – wysyła dane do backendu.
- [Baza danych](../database/README.md) – przechowuje dane aplikacji.
- [Diagram ERD](../materialy/erd.md) – pokazuje tabele i ich powiązania.

## Aktualny stan

Na razie folder zawiera opis tego, co będzie robić backend. Kod serwera zostanie dodany w późniejszym etapie.
