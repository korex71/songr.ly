funcionarios = ["Ana", "Maria", "João", "Eliezer"]
sizeFuncionarios = len(funcionarios)

reajuste = 10 / 100  # %

salario = 1300  # R$


print(f"Quantidade de pessoas", sizeFuncionarios)

for pessoa in funcionarios:
    print(pessoa, sep=" ", end=", ")
else:
    print(f"Total de {sizeFuncionarios} funcionários.")
    print(f"Valor dos salarios: {salario}")
    print(f"Reajuste de {reajuste * 100}%")
    print(f"Valor após o reajuste: {salario * (1 - reajuste)}")
    print(f"Valor descontado: {1300 * reajuste}")
