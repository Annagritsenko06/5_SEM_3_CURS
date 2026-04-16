#pragma comment(lib, "WS2_32.lib") 
#pragma warning(disable: 4996)
#include "Winsock2.h"
#include "stdafx.h"

#include <algorithm>
#include <iostream>
#include <string>

using namespace std;
int countServers = 0;

bool GetRequestFromClient(char* name, short port, struct sockaddr* from, int* flen);
bool PutAnswerToClient(char* name, short port, struct sockaddr* to, int* lto);

int main() 
{
	SetConsoleCP(1251);
	SetConsoleOutputCP(1251);

	SOCKET sS;
	WSADATA wsaData;

	SOCKADDR_IN client;
	int clientSize = sizeof(client);
	char name[] = "Hello";
	char hostname[32];

	try
	{
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)
			throw  SetErrorMsgText("Startup:", WSAGetLastError());

		cout << "Checking for other servers..." << endl;


		if ((sS = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET)
			throw  SetErrorMsgText("socket:", WSAGetLastError());


		SOCKADDR_IN serv;
		serv.sin_family = AF_INET;
		serv.sin_port = htons(2000);
		serv.sin_addr.s_addr = INADDR_ANY;

		if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)
			throw  SetErrorMsgText("bind:", WSAGetLastError());

		SOCKADDR_IN clientB;
		int clientSize = sizeof(clientB);

		if (gethostname(hostname, sizeof(hostname)) == SOCKET_ERROR)
			throw SetErrorMsgText("gethostname:", WSAGetLastError());
		cout << "Server name: " << hostname << endl;

		while (true)
		{
			if (GetRequestFromClient(name, sS, (SOCKADDR*)&clientB, &clientSize))
			{
				cout << endl;
				cout << "Client socket:" << endl;
				cout << "IP: " << inet_ntoa(clientB.sin_addr) << endl;
				cout << "Port: " << ntohs(clientB.sin_port) << endl;

				hostent* remoteHost = gethostbyaddr((char*)&clientB.sin_addr, sizeof(clientB.sin_addr), AF_INET);
				if (remoteHost != nullptr)
					cout << "Hostname: " << remoteHost->h_name << endl;
				else
					cout << "Hostname not found" << endl;
				cout << endl;

				if (PutAnswerToClient(name, sS, (SOCKADDR*)&clientB, &clientSize))
				{
					cout << "Success!" << endl;
				}
			}
			else
			{
				cout << "Wrong call name!" << endl;
			}
		}

		if (closesocket(sS) == SOCKET_ERROR)
			throw  SetErrorMsgText("closesocket:", WSAGetLastError());

		if (WSACleanup() == SOCKET_ERROR)
			throw  SetErrorMsgText("Cleanup:", WSAGetLastError());

	}
	catch (string errorMsgText)
	{
		std::cout << endl << "WSAGetLastError: " << errorMsgText;
	}

}


bool GetRequestFromClient(char* name, short port, struct sockaddr* from, int* flen)
{
	char buf[50] = "";
	int lenght;
	cout << "\nWait message..." << endl;

	while (true)
	{
		if (lenght = recvfrom(port, buf, sizeof(buf), NULL, from, flen) == SOCKET_ERROR)
		{
			cout << "Error:" << endl;
			if (WSAGetLastError() == WSAETIMEDOUT)
				return false;
			else
				throw SetErrorMsgText("Recvfrom: ", WSAGetLastError());
		}
		return strcmp(buf, name) == 0;
	}
}

bool PutAnswerToClient(char* name, short port, struct sockaddr* to, int* lto)
{
	int lenghts = strlen(name);
	return sendto(port, name, lenghts + 1, NULL, to, *lto);
}



