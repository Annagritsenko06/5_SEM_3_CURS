#include <stdio.h>
#include <unistd.h>
int g_init = 52;          
int g_uninit;             

static int gs_init = 91;  
static int gs_uninit;     
void simple_function(void) {

    printf("Simple function\n");
}
int main(int argc, char* argv[]) {
    int l_init = 5;       
    int l_uninit;         

    static int ls_init = 119; 
    static int ls_uninit;     

    printf("PID: %d\n", getpid());
   printf("\nFunctions: \n");
    printf(" simple_function:  %p\n", (void*)demo_function);
    printf(" main:           %p\n", (void*)main);
    printf("\nGlobals:\n");
    printf(" &g_init:        %p\n", (void*)&g_init);
    printf(" &g_uninit:      %p\n", (void*)&g_uninit);
    printf(" &gs_init:       %p\n", (void*)&gs_init);
    printf(" &gs_uninit:     %p\n", (void*)&gs_uninit);
    printf("\nLocals:\n");
    printf(" &l_init:        %p\n", (void*)&l_init);
    printf(" &l_uninit:      %p\n", (void*)&l_uninit);
    printf("\nLocal static:\n");
    printf(" &ls_init:       %p\n", (void*)&ls_init);
    printf(" &ls_uninit:     %p\n", (void*)&ls_uninit);
    printf("\nArgs:\n");
    printf(" &argc:          %p\n", (void*)&argc);
    printf(" argv:           %p\n", (void*)argv);
    printf(" argv[0]:        %p\n", (void*)argv[0]);
    getchar();
    return 0;}
