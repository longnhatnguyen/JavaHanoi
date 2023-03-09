package lesson_6;

import java.util.Scanner;

public class Student extends Person{
    private String schoolname;

    @Override
    public void input(Scanner scanner) {
        super.input(scanner);
        System.out.println("Nhap vao ten truong");
        this.schoolname = scanner.nextLine();
    }

    @Override
    public String info() {
        StringBuilder builder = new StringBuilder();
        builder.append(super.info()).append("ten truong").append(this.schoolname);
        return builder.toString();
    }

    public String getSchoolname() {
        return schoolname;
    }

    public void setSchoolname(String schoolname) {
        this.schoolname = schoolname;
    }
}
