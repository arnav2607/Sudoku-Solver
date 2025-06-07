#include<iostream>
using namespace std;

void Print(int board[][9], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << board[i][j] << " ";
        }
        cout << endl;
    }
}

bool isvalid(int i, int j, int board[][9], int num) {
 
    for (int k = 0; k < 9; k++) {
        if (board[i][k] == num) {
            return false;
        }
    }
    for (int k = 0; k < 9; k++) {
        if (board[k][j] == num) {
            return false;
        }
    }
    
    // Check the 3x3 subgrid
    int row = i / 3 * 3;
    int col = j / 3 * 3;
    for (int k = row; k < row + 3; k++) {
        for (int l = col; l < col + 3; l++) {
            if (board[k][l] == num) {
                return false;
            }
        }
    }
    return true;
}

bool sudokusolver(int board[][9], int i, int j, int n) {
    if (i == n) {
        Print(board, n);
        return true;
    }
    
    if (j == n) {
        return sudokusolver(board, i + 1, 0, n);
    }
    
    if (board[i][j] != 0) {
        return sudokusolver(board, i, j + 1, n);
    }
    
    for (int num = 1; num <= 9; num++) {
        if (isvalid(i, j, board, num)) {
            board[i][j] = num;
            bool subans = sudokusolver(board, i, j + 1, n);
            if (subans) {
                return true;
            }
            // Backtrack
            board[i][j] = 0;
        }
    }
    return false;
}

int main() {
    int n = 9;
    int board[9][9] = {
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0}
    };
    
    if (!sudokusolver(board, 0, 0, n)) {
        cout << "No solution exists." << endl;
    }

    return 0;
}
