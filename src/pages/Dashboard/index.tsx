import React, { FormEvent, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

import { Title, Form, Repositories, Erro } from './styles';
import { FiChevronRight } from 'react-icons/fi';
import { AxiosResponse } from 'axios';
import { TrueLiteral } from 'typescript';

interface Repository {
  full_name: string;
  description?: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputErro, setInputErro] = useState('');

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
        console.log(res);

        if (res.status >= 200 && res.status <= 299) {
          setRepositories([...repositories, res.data]);
          console.log(repositories);
        } else {
          throw new Error(res.statusText);
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
      setInputErro('Digite o nome/autor do repositório');
      return;
    }

    try {
      const res = await api.get<Repository>(`repos/${newRepo}`);
      const repo = res.data;
      setInputErro('');
      setNewRepo('');
      setRepositories([...repositories, repo]);
    } catch (err) {
      setInputErro('Erro na busca por esse repositório');
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
      <Form hasError={!!inputErro} onSubmit={handleAddRepoWithPromise}>
        <input
          value={newRepo}
          onChange={(evt) => setNewRepo(evt.target.value)}
          placeholder="Digite o nome do repositorio"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputErro && <Erro>{inputErro}</Erro>}

      <Repositories>
        {!isLoading &&
          repositories.map((repo) => (
            <Link
              key={repo.full_name}
              href={repo.html_url}
              to={`/repository/${repo.full_name}`}
            >
              <img src={repo.owner.avatar_url} alt={repo.owner.login} />
              <div>
                <strong>{repo.full_name}</strong>
                <p>{repo.description}</p>
              </div>
              <FiChevronRight size={20} />
            </Link>
          ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
