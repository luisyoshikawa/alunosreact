import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {
  HiOutlineClipboardDocumentList,
  HiMiniTrash,
  HiMiniPencilSquare,
  HiMiniUserPlus,
} from 'react-icons/hi2';

function App() {
  const baseUrl = 'https://localhost:7116/api/alunos/';

  const [data, setData] = React.useState([]);
  const [updateData, setUpdateData] = React.useState(true);

  const pedidoGet = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoPost = async () => {
    delete alunoSelecionado.id;
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios
      .post(baseUrl, alunoSelecionado)
      .then((response) => {
        setData(data.concat(response.data));
        setUpdateData(true);
        handleModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoEdit = async () => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios
      .put(baseUrl + alunoSelecionado.id, alunoSelecionado)
      .then((response) => {
        let resposta = response.data;
        let dadosAuxiliar = data;
        dadosAuxiliar.map((aluno) => {
          if (aluno.id === alunoSelecionado.id) {
            aluno.nome = resposta.nome;
            aluno.email = resposta.email;
            aluno.idade = resposta.idade;
          }
        });
        setUpdateData(true);
        handleModalEdit();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoDelete = async () => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios
      .delete(baseUrl + alunoSelecionado.id)
      .then((response) => {
        setData(data.filter((aluno) => aluno.id !== response.data));
        setUpdateData(true);
        handleModalDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData]);

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);
    opcao === 'Editar' && handleModalEdit();
    opcao === 'Excluir' && handleModalDelete();
  };

  const [alunoSelecionado, setAlunoSelecionado] = React.useState({
    id: '',
    nome: '',
    email: '',
    idade: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado,
      [name]: value,
    });
    console.log(alunoSelecionado);
  };

  const [modalAberto, setModalAberto] = React.useState(false);

  const handleModal = () => {
    setModalAberto(!modalAberto);
  };

  const [modalEdit, setModalEdit] = React.useState(false);

  const handleModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const [modalDelete, setModalDelete] = React.useState(false);

  const handleModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  return (
    <div className="m-2">
      <header className="d-flex flex-row justify-content-around align-items-center">
        <h3>
          Cadastro de Alunos <HiOutlineClipboardDocumentList />
        </h3>
        <button className="btn btn-success m-2" onClick={handleModal}>
          Incluir Novo Aluno <HiMiniUserPlus />
        </button>
      </header>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nome</th>
            <th scope="col">Email</th>
            <th scope="col">Idade</th>
            <th scope="col">Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button
                  className="btn btn-primary m-2"
                  onClick={() => selecionarAluno(aluno, 'Editar')}
                >
                  Editar <HiMiniPencilSquare />
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => selecionarAluno(aluno, 'Excluir')}
                >
                  Excluir <HiMiniTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalAberto}>
        <ModalHeader>Incluir Alunos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
              required
            />

            <label>Email: </label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
              required
            />

            <label>Idade: </label>
            <input
              type="text"
              className="form-control"
              name="idade"
              onChange={handleChange}
              required
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={pedidoPost}>
            Incluir <HiMiniUserPlus />
          </button>
          <button className="btn btn-danger" onClick={handleModal}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit}>
        <ModalHeader>Editar Aluno</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input
              type="text"
              className="form-control"
              readOnly
              disabled
              value={alunoSelecionado && alunoSelecionado.id}
            />
            <label>Nome: </label>
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.nome}
            />
            <label>Email: </label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.email}
            />
            <label>Idade: </label>
            <input
              type="text"
              className="form-control"
              name="idade"
              onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.idade}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoEdit()}>
            Editar <HiMiniPencilSquare />
          </button>
          <button className="btn btn-danger" onClick={handleModalEdit}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
        <ModalBody>
          Confirma a exclusão deste(a) aluno(a):{' '}
          {alunoSelecionado && alunoSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={pedidoDelete}>
            Sim <HiMiniTrash />
          </button>
          <button className="btn btn-secondary" onClick={handleModalDelete}>
            Não
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
