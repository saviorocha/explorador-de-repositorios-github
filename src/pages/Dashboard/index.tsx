import React, { FormEvent, useEffect, useState } from 'react';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

import { Title, Form, Repositories, Error } from './styles';
import { FiChevronRight } from 'react-icons/fi';
import { AxiosResponse } from 'axios';
import { TrueLiteral } from 'typescript';

interface Repository {
  full_name: string;
  description?: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState('');

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    }
    return [];
  });

  const handleAddRepoWithPromise = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsLoading(true);
    api
      .get(`repos/${newRepo}`)
      .then((res: AxiosResponse<Repository>) => {
        if (res.status >= 200 && res.status <= 299) {
          setRepositories([...repositories, res.data]);
        } else {
          // throw new Error(res.statusText);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  async function handleAddRepository(
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    evt.preventDefault();

    if (!newRepo) {
      setInputError('Digite o nome/autor do repositório');
      return;
    }

    try {
      const res = await api.get<Repository>(`repos/${newRepo}`);
      const repo = res.data;
      setInputError('');
      setNewRepo('');
      setRepositories([...repositories, repo]);
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explorador de repositórios do GitHub</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(evt) => setNewRepo(evt.target.value)}
          placeholder="Digite o nome do repositorio"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {!isLoading &&
          repositories.map((repo) => (
            <a key={repo.full_name} href="testeetset  ">
              <img src={repo.owner.avatar_url} alt={repo.owner.login} />
              <div>
                <strong>{repo.full_name}</strong>
                <p>{repo.description}</p>
              </div>
              <FiChevronRight size={20} />
            </a>
          ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
