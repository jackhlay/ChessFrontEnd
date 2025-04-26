# Chess Front End

## A simple front end for a real-time chess board

### Features

- Real-time updates of the chess board position
- Evaluation bar showing the evaluation from two different sources
- Responsive design


### Usage

1.  Install the dependencies:
    ```sh
    npm install
    ```
2. Start the server:
    ```sh
    node server.js
    ```
3. Open your browser and navigate to `http://localhost:5000`
  
4. To interact with the board, simply send a post request to `http://localhost:5000/api/update`. View the expected body below.

### API

- `POST /api/update`: Update the chess board position and evaluations.
    - Request body:
        ```json
        {
          "fen": "string",
          "evalSource1": "string",
          "evalSource2": "string"
        }
        ```

### Example

![](ex.gif)