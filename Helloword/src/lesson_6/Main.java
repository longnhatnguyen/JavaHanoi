package lesson_6;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Person person = new Person();
        person.input(scanner);
        System.out.println(person.info());
    }
}
